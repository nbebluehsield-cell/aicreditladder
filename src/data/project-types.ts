import type { ProjectType } from "@/lib/types";

export const PROJECT_TYPES: ProjectType[] = [
  { slug: "ai-coding-tool", label: "AI coding tool", description: "Copilots, code gen, dev agents" },
  { slug: "chatbot", label: "Chatbot / assistant", description: "General-purpose conversational apps" },
  { slug: "voice-app", label: "Voice app", description: "TTS, STT, realtime voice agents" },
  { slug: "video-app", label: "Video app", description: "Video gen, editing, analysis" },
  { slug: "image-app", label: "Image app", description: "Image gen, editing, vision" },
  { slug: "workflow-automation", label: "Workflow automation", description: "Automations, integrations, ops" },
  { slug: "rag-app", label: "RAG app", description: "Retrieval-augmented apps on your data" },
  { slug: "agent", label: "Agent product", description: "Multi-step autonomous agents" },
  { slug: "b2b-internal", label: "B2B internal AI", description: "Internal productivity and knowledge tools" },
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
