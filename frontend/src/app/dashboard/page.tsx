"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

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
                } else {
                    router.push("/login");
                }
            }).catch(() => router.push("/login"));
    }, [router]);

    if (!user) return <div className="p-8 text-center animate-pulse h-screen flex justify-center items-center">Loading interface...</div>;

    return (
        <div className="min-h-screen relative p-4 md:p-8 overflow-hidden bg-[#0a0a0a]">
            {/* Glow Effect */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] opacity-20 pointer-events-none blur-[120px] bg-gradient-to-bl from-blue-700 to-violet-800 rounded-full" />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-500">
                <header className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white text-sm">✨</span>
                            </div>
                            Starter Workspace
                        </h1>
                        <p className="text-neutral-400 mt-1 pl-11">Welcome back, {user.name || user.email}</p>
                    </div>
                    <Button variant="ghost" className="text-neutral-400 hover:text-white" onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}>Sign Out</Button>
                </header>

                <Card className="shadow-2xl border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 pb-6">
                        <CardTitle className="text-xl text-white">Your Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6 text-neutral-400">
                        <p>This is the free open-source starter kit.</p>
                        <p>To access the OpenAI integrations, Stripe Billing functionality, and advanced interactive telemetry, upgrade to the Pro version on Gumroad.</p>
                        <div className="pt-6">
                            <Button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500">
                                Upgrade to Pro
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

