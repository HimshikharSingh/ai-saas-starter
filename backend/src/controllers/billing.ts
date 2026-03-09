import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from 'database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_build', {
    apiVersion: '2023-10-16' as any,
});

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { priceId } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            client_reference_id: userId,
            customer_email: user.email,
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?canceled=true`,
        });

        res.status(200).json({ checkoutUrl: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

export const createPortalSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const subscription = await prisma.subscription.findUnique({ where: { userId } });
        if (!subscription?.stripeCustomerId) {
            return res.status(400).json({ error: 'No active Stripe customer found.' });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
        });

        res.status(200).json({ portalUrl: portalSession.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create portal session' });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.client_reference_id;
                const subscriptionId = session.subscription as string;
                const customerId = session.customer as string;

                if (userId) {
                    await prisma.subscription.update({
                        where: { userId },
                        data: {
                            stripeCustomerId: customerId,
                            stripeSubscriptionId: subscriptionId,
                            tier: 'PRO',
                            monthlyTokenLimit: 100000,
                            status: 'active',
                        }
                    });
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: 'canceled',
                        tier: 'FREE',
                        monthlyTokenLimit: 10000
                    }
                });
                break;
            }
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ error: 'Webhook handler failed' });
    }

    res.status(200).json({ received: true });
};
