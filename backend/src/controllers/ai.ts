import { Request, Response } from 'express';
import { prisma } from 'database';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
});

export const generateText = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { prompt, modelId = 'gpt-4o-mini' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const subscription = await prisma.subscription.findUnique({
            where: { userId }
        });

        if (!subscription) {
            return res.status(400).json({ error: 'Subscription not found' });
        }

        const estimatedTokens = Math.ceil(prompt.length / 4) + 500;

        if (subscription.tokensUsed + estimatedTokens > subscription.monthlyTokenLimit) {
            return res.status(429).json({ error: 'Monthly token limit exceeded. Please upgrade.' });
        }

        // Skip actual AI call if no valid key is present and we're just templating
        if (process.env.OPENAI_API_KEY === 'dummy_key_for_build' || !process.env.OPENAI_API_KEY) {
            const generatedText = `[MOCK AI RESPONSE]: You said: "${prompt}". Please add a real OPENAI_API_KEY in .env`;

            await prisma.$transaction([
                prisma.apiRequest.create({
                    data: {
                        userId,
                        endpoint: '/ai/generate',
                        tokensUsed: estimatedTokens,
                        promptSummary: prompt.substring(0, 50) + '...',
                    }
                }),
                prisma.subscription.update({
                    where: { userId },
                    data: { tokensUsed: { increment: estimatedTokens } }
                })
            ]);

            return res.status(200).json({
                result: generatedText,
                tokensUsed: estimatedTokens,
                remaining: subscription.monthlyTokenLimit - (subscription.tokensUsed + estimatedTokens)
            });
        }

        const completion = await openai.chat.completions.create({
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
        });

        const resultText = completion.choices[0].message?.content || '';
        const actualTokensUsed = completion.usage?.total_tokens || estimatedTokens;

        await prisma.$transaction([
            prisma.apiRequest.create({
                data: {
                    userId,
                    endpoint: '/ai/generate',
                    tokensUsed: actualTokensUsed,
                    promptSummary: prompt.substring(0, 50) + '...',
                }
            }),
            prisma.subscription.update({
                where: { userId },
                data: { tokensUsed: { increment: actualTokensUsed } }
            })
        ]);

        res.status(200).json({
            result: resultText,
            tokensUsed: actualTokensUsed,
            remaining: subscription.monthlyTokenLimit - (subscription.tokensUsed + actualTokensUsed)
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
};
