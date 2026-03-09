"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [prompt, setPrompt] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [tokenInfo, setTokenInfo] = useState({ used: 0, limit: 10000 });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                    if (data.user.subscription) {
                        setTokenInfo({
                            used: data.user.subscription.tokensUsed,
                            limit: data.user.subscription.monthlyTokenLimit
                        });
                    }
                } else {
                    router.push("/login");
                }
            }).catch(() => router.push("/login"));
    }, [router]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/ai/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            if (res.ok) {
                setAiResponse(data.result);
                setTokenInfo(prev => ({ ...prev, used: prev.used + data.tokensUsed }));
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateCheckout = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/billing/create-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ priceId: "price_dummy_test" })
        });
        const data = await res.json();
        if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    };

    if (!user) return <div className="p-8 text-center text-sm text-neutral-500 animate-pulse h-screen flex items-center justify-center">Loading interface...</div>;

    const progressPercentage = Math.min((tokenInfo.used / tokenInfo.limit) * 100, 100);

    return (
        <div className="min-h-screen relative p-4 md:p-8 overflow-hidden bg-[#0a0a0a]">
            {/* Glow Effect */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] opacity-20 pointer-events-none blur-[120px] bg-gradient-to-bl from-blue-700 to-violet-800 rounded-full" />

            <div className="max-w-6xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-500">
                <header className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white text-sm">✨</span>
                            </div>
                            Synthetix Workspace
                        </h1>
                        <p className="text-neutral-400 mt-1 pl-11">Welcome back, {user.name || user.email}</p>
                    </div>
                    <Button variant="ghost" className="text-neutral-400 hover:text-white" onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}>Sign Out</Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 shadow-2xl border-white/10 bg-black/40 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/5 pb-6">
                            <CardTitle className="text-xl text-white">Neural Engine Interface</CardTitle>
                            <CardDescription className="text-neutral-400">Query the GPT-4o architecture using your token pool.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <Input
                                    placeholder="Analyze the following dataset and extract sentiment..."
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    className="relative font-mono text-sm h-14 bg-[#0a0a0a] border-white/10 text-white placeholder-neutral-600 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-xl"
                                />
                            </div>
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                size="lg"
                                className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-xl"
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                                        Processing Request...
                                    </span>
                                ) : (
                                    "Execute Query →"
                                )}
                            </Button>

                            {aiResponse && (
                                <div className="p-6 bg-black/60 border border-white/10 rounded-xl mt-6 whitespace-pre-wrap leading-relaxed shadow-inner font-mono text-sm text-neutral-300 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                    {aiResponse}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl border-white/10 bg-black/40 backdrop-blur-xl h-fit">
                        <CardHeader className="border-b border-white/5 pb-6">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-white">Telemetry</CardTitle>
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 uppercase tracking-widest">
                                    {user.subscription?.tier}
                                </span>
                            </div>
                            <CardDescription className="text-neutral-400">Current billing cycle usage.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-neutral-400">Compute Tokens</span>
                                    <span className="text-white font-mono">{tokenInfo.used.toLocaleString()} <span className="text-neutral-600">/ {tokenInfo.limit.toLocaleString()}</span></span>
                                </div>
                                <Progress value={progressPercentage} className="h-2 rounded-full bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-violet-500" />
                                <p className="text-xs text-neutral-500 flex items-center gap-1.5 pt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active connection
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                {user.subscription?.tier === "FREE" ? (
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg transition-transform hover:scale-[1.02] border border-white/10 rounded-xl" onClick={handleCreateCheckout}>
                                        Upgrade Architecture
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full shadow-sm bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl" onClick={handleCreateCheckout}>
                                        Manage Infrastructure
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
