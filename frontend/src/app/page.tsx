import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none blur-[100px] bg-gradient-to-b from-blue-600 to-transparent rounded-full" />

      <header className="px-6 py-4 flex items-center justify-between z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <h1 className="font-extrabold text-xl tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-xs">✨</span>
          </div>
          Synthetix<span className="text-neutral-500 font-normal">.ai</span>
        </h1>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/10">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 z-10">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Synthetix 2.0 is now live
          </div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-neutral-500 drop-shadow-sm leading-tight pb-2">
            Write code at the <br /> speed of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">thought.</span>
          </h2>

          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            The ultimate developer toolkit to ship AI products in a weekend. Includes pre-built authentication, Stripe billing, and OpenAI wrappers perfectly integrated.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:scale-105 rounded-full font-medium">
                Start Building Free
              </Button>
            </Link>
            <Link href="https://github.com/HimshikharSingh/ai-saas-starter" target="_blank">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-neutral-700 bg-black/50 backdrop-blur-md hover:bg-neutral-800 text-neutral-300 rounded-full font-medium transition-all hover:scale-105">
                View GitHub Repo
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-24 w-full max-w-5xl rounded-xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl shadow-blue-900/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none h-full w-full" />
          <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>
          <div className="p-8 aspect-video flex flex-col">
            <div className="w-fit h-8 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-md mb-8 flex items-center px-4 border border-blue-500/20">
              <span className="text-blue-400 text-sm font-semibold tracking-wider">SYNTHETIX NEURAL ENGINE</span>
            </div>
            <div className="flex gap-6 h-full text-left">
              <div className="w-2/3 h-full bg-white/5 rounded-lg border border-white/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
                <h3 className="text-white font-medium mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div className="w-full h-12 bg-black/40 rounded border border-white/10 flex items-center px-4">
                    <span className="text-neutral-500 text-sm font-mono">sk_live_synthetix_...</span>
                  </div>
                  <div className="w-3/4 h-12 bg-black/40 rounded border border-white/10 flex items-center px-4">
                    <span className="text-neutral-500 text-sm font-mono">https://api.openai.com/v1</span>
                  </div>
                </div>
              </div>
              <div className="w-1/3 h-full flex flex-col gap-6">
                <div className="h-1/2 w-full bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-lg p-6 flex flex-col justify-between text-left">
                  <span className="text-neutral-400 text-sm">Compute Tokens</span>
                  <span className="text-4xl font-bold tracking-tighter text-white">84.2K</span>
                  <div className="w-full h-2 bg-blue-900/50 rounded-full overflow-hidden mt-4">
                    <div className="w-3/4 h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="h-1/2 w-full bg-white/5 border border-white/5 rounded-lg p-6 flex flex-col justify-between text-left">
                  <span className="text-neutral-400 text-sm">Stripe MRR</span>
                  <span className="text-3xl font-bold tracking-tighter text-green-400">$4,290</span>
                  <span className="text-green-500/50 text-xs">+12.5% this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-neutral-600 border-t border-white/5 z-10 bg-black/50 backdrop-blur-md">
        © {new Date().getFullYear()} Synthetix AI Starter. Built for builders.
      </footer>
    </div>
  );
}
