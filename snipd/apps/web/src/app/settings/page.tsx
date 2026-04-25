"use client";

import { useState } from "react";
import { Settings, Key, Database, Share2, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

interface ConfigField {
  key: string;
  label: string;
  placeholder: string;
  description: string;
  type?: string;
}

const sections: { title: string; icon: React.ReactNode; fields: ConfigField[] }[] = [
  {
    title: "AI & Transcription",
    icon: <Key className="w-4 h-4" />,
    fields: [
      { key: "openai", label: "OpenAI API Key", placeholder: "sk-...", description: "Used for Whisper transcription. Get one at platform.openai.com", type: "password" },
      { key: "anthropic", label: "Anthropic API Key", placeholder: "sk-ant-...", description: "Used for Claude AI summaries. Get one at console.anthropic.com", type: "password" },
    ],
  },
  {
    title: "Podcast Index",
    icon: <Database className="w-4 h-4" />,
    fields: [
      { key: "pi_key", label: "Podcast Index API Key", placeholder: "Your API key", description: "Free at podcastindex.org — used for podcast search", type: "password" },
      { key: "pi_secret", label: "Podcast Index API Secret", placeholder: "Your API secret", description: "Paired with your API key", type: "password" },
    ],
  },
  {
    title: "Exports",
    icon: <Share2 className="w-4 h-4" />,
    fields: [
      { key: "notion_token", label: "Notion Integration Token", placeholder: "secret_...", description: "Create an integration at notion.so/my-integrations", type: "password" },
      { key: "notion_db", label: "Notion Database ID", placeholder: "32-character ID", description: "The ID from your Notion database URL" },
      { key: "readwise_token", label: "Readwise Access Token", placeholder: "Your token", description: "Get at readwise.io/access_token", type: "password" },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});

  const save = () => {
    toast("Settings saved locally. Set these as environment variables for full functionality.", "info");
  };

  return (
    <div className="min-h-full p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-brand-400" />
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">Configure your API keys and integrations.</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
                <span className="text-brand-400">{section.icon}</span>
                <h2 className="font-semibold text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-foreground block mb-1.5">{field.label}</label>
                    <input
                      type={field.type ?? "text"}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Env var reminder */}
          <div className="glass-card rounded-2xl p-5 border-brand-800/30 bg-brand-950/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-brand-300 mb-1">Tip: Use environment variables</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For production, set your keys as environment variables in <code className="text-brand-300 bg-brand-950/60 px-1 rounded">.env.local</code> rather than entering them here. See the setup guide in the project README.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={save}
            className="w-full py-3 rounded-xl bg-gradient-brand text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
