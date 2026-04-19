import type { ProjectType } from "@/lib/types";

export const PROJECT_TYPES: ProjectType[] = [
  {
    slug: "ai-coding-tool",
    label: "AI coding tool",
    headline:
      "These are free and paid credits for AI coding tools — copilots, IDEs, and the APIs you actually ship code with.",
    headlineAccent: "AI coding tools",
    description:
      "Every major AI IDE and copilot ships a free tier worth using. Here's what to install this weekend — no credit card, no waitlist",
  },
  {
    slug: "chatbot",
    label: "Chatbot / assistant",
    headline:
      "Startup credits for chatbots and assistants — hosted models, APIs, and inference you can wire up without a sales call.",
    headlineAccent: "chatbots and assistants",
    description: "Credits that stack for general-purpose conversational apps",
  },
  {
    slug: "voice-app",
    label: "Voice app",
    headline:
      "Credits for voice apps: speech-to-text, text-to-speech, and realtime voice agents you can put in front of users.",
    headlineAccent: "voice apps",
    description: "TTS, STT, and realtime voice agent credits",
  },
  {
    slug: "video-app",
    label: "Video app",
    headline:
      "Credits for video generation, editing, and analysis — the vendor programs that cover render time and model access.",
    headlineAccent: "video generation, editing, and analysis",
    description: "Credits for video generation, editing, and analysis",
  },
  {
    slug: "image-app",
    label: "Image app",
    headline:
      "Credits for image generation, editing, and vision APIs — so you can ship pixels before you burn runway on GPUs.",
    headlineAccent: "image generation, editing, and vision APIs",
    description: "Credits for image gen, editing, and vision",
  },
  {
    slug: "workflow-automation",
    label: "Workflow automation",
    headline:
      "Credits for workflow automation and integrations — connectors, triggers, and ops stacks that run while you sleep.",
    headlineAccent: "workflow automation and integrations",
    description: "Credits for automations, integrations, and ops",
  },
  {
    slug: "rag-app",
    label: "RAG app",
    headline:
      "Credits for RAG and retrieval-heavy apps — embeddings, vector stores, and inference priced for experiments, not demos.",
    headlineAccent: "RAG and retrieval-heavy apps",
    description: "Credits that stack for retrieval-augmented apps on your data",
  },
  {
    slug: "agent",
    label: "Agent product",
    headline:
      "Credits for agent products and multi-step autonomous workflows — the programs that fund serious agents, not toy prompts.",
    headlineAccent: "agent products and multi-step autonomous workflows",
    description: "Credits for multi-step autonomous agents",
  },
  {
    slug: "b2b-internal",
    label: "B2B internal AI",
    headline:
      "Credits for internal AI and B2B productivity tools — knowledge bases, copilots, and enterprise programs your team can qualify for.",
    headlineAccent: "internal AI and B2B productivity tools",
    description: "Credits for internal productivity and knowledge tools",
  },
];

export const STAGE_LABEL = {
  now: "Now",
  next: "Next",
  later: "Later",
} as const;

export const STAGE_DESCRIPTION = {
  now: "Claim today — low-friction, solo-founder-friendly.",
  next: "Unlock with a registered company or corporate domain.",
  later: "Open once you have traction, a partner, or funding.",
} as const;
