import React from 'react';
import LogoLoop from './reactbits/LogoLoop';
import {
  SiAnthropic,
  SiGoogle,
  SiMeta,
  SiHuggingface,
  SiPython,
  SiTypescript,
  SiOpenrouter,
  SiMistralai,
  SiNvidia,
  SiGithub,
  SiOpentelemetry,
} from 'react-icons/si';

const agenticLogos = [
  {
    node: <SiAnthropic className="w-7 h-7" />,
    title: "Anthropic (Claude 3.7)",
    href: "https://www.anthropic.com",
    hoverColor: "#d97706",
  },
  {
    node: <SiGoogle className="w-7 h-7" />,
    title: "Google DeepMind (Gemini)",
    href: "https://deepmind.google",
    hoverColor: "#38bdf8",
  },
  {
    node: <SiMeta className="w-7 h-7" />,
    title: "Meta AI (Llama 4)",
    href: "https://ai.meta.com",
    hoverColor: "#0284c7",
  },
  {
    node: <SiHuggingface className="w-7 h-7" />,
    title: "Hugging Face (Open Models)",
    href: "https://huggingface.co",
    hoverColor: "#facc15",
  },
  {
    node: <SiMistralai className="w-7 h-7" />,
    title: "Mistral AI",
    href: "https://mistral.ai",
    hoverColor: "#f97316",
  },
  {
    node: <SiNvidia className="w-7 h-7" />,
    title: "NVIDIA NIM",
    href: "https://www.nvidia.com",
    hoverColor: "#76b900",
  },
  {
    node: <SiOpenrouter className="w-7 h-7" />,
    title: "OpenRouter",
    href: "https://openrouter.ai",
    hoverColor: "#a855f7",
  },
  {
    node: <SiPython className="w-7 h-7" />,
    title: "Python Agent Frameworks",
    href: "https://python.org",
    hoverColor: "#38bdf8",
  },
  {
    node: <SiTypescript className="w-7 h-7" />,
    title: "TypeScript / MCP SDK",
    href: "https://www.typescriptlang.org",
    hoverColor: "#3b82f6",
  },
  {
    node: <SiOpentelemetry className="w-7 h-7" />,
    title: "OpenTelemetry Agent Tracing",
    href: "https://opentelemetry.io",
    hoverColor: "#f43f5e",
  },
  {
    node: <SiGithub className="w-7 h-7" />,
    title: "GitHub Workspaces",
    href: "https://github.com",
    hoverColor: "#ffffff",
  },
];

export function LogoLoopSection({ className = '' }) {
  return (
    <div className={`relative py-6 sm:py-8 border-t border-white/5 bg-[#050508]/40 backdrop-blur-sm overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <p className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] text-slate-400 font-medium">
          Tracking Advancements Across Frontier Ecosystems & Protocols
        </p>
      </div>

      <div className="relative w-full h-14 flex items-center">
        <LogoLoop
          logos={agenticLogos}
          speed={60}
          direction="left"
          logoHeight={32}
          gap={48}
          hoverSpeed={0}
          scaleOnHover={true}
          labels="hover"
          ariaLabel="Agentic AI technologies and organizations"
          className="w-full"
        />
      </div>
    </div>
  );
}
