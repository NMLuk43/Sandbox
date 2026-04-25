import { TrendingUp, Headphones, Scissors, Sparkles } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Podcasts", value: "0", icon: Headphones, href: "/discover" },
  { label: "Snips", value: "0", icon: Scissors, href: "/snips" },
  { label: "Hours Listened", value: "0", icon: TrendingUp, href: "/library" },
  { label: "AI Summaries", value: "0", icon: Sparkles, href: "/snips" },
];

const quickActions = [
  { label: "Discover Podcasts", href: "/discover", description: "Search thousands of shows", icon: "🎙️" },
  { label: "My Library", href: "/library", description: "Your subscribed podcasts", icon: "📚" },
  { label: "My Snips", href: "/snips", description: "Captured moments & notes", icon: "✂️" },
];

export default function HomePage() {
  return (
    <div className="min-h-full p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Hero */}
        <div className="pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-300 text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            AI-Powered Podcast Knowledge
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            Discover podcasts, capture key moments, and build your personal knowledge base — all powered by AI.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <div className="glass-card rounded-2xl p-5 hover:border-brand-800/40 transition-all duration-200 group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground text-sm">{stat.label}</span>
                  <stat.icon className="w-4 h-4 text-brand-400 group-hover:text-brand-300 transition-colors" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Get started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="glass-card rounded-2xl p-6 hover:border-brand-800/40 hover:glow-sm transition-all duration-200 group cursor-pointer">
                  <div className="text-3xl mb-4">{action.icon}</div>
                  <h3 className="font-semibold text-foreground group-hover:text-brand-300 transition-colors mb-1">
                    {action.label}
                  </h3>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity placeholder */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Continue listening</h2>
          <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <Headphones className="w-10 h-10 text-brand-400/50 mb-3" />
            <p className="text-muted-foreground text-sm">No recent episodes yet.</p>
            <Link href="/discover" className="mt-3 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
              Find something to listen to →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
