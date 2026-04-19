/**
 * Curated stacks — editorial bundles of 3–5 offers that *go together*
 * for a specific build. A solo founder lands thinking "I need to ship X"
 * and gets a hand-picked combination plus the rationale for each pick.
 *
 * Each stack is a claim: *these* offers, in *this* order, are what we'd
 * apply for first. Keep the roster tight — five picks per stack max.
 */

export type StackPick = {
  slug: string;
  /** One line: why this offer in this stack. Not a repeat of the note. */
  role: string;
};

export type Stack = {
  slug: string;
  label: string;
  /** One-line editorial tagline that names the build. */
  tagline: string;
  /** 2–4 sentences: who this is for and what they'll ship. */
  blurb: string;
  picks: StackPick[];
};

export const STACKS: Stack[] = [
  {
    slug: "solo-rag-app",
    label: "Solo RAG app",
    tagline: "Ship a retrieval-augmented chatbot over your own docs by Sunday.",
    blurb:
      "Embeddings, a vector store, an inference endpoint, and a deploy target — all on free or trial tiers, no VC required. Enough headroom to demo with real users before you touch a credit card.",
    picks: [
      {
        slug: "google-ai-studio-free",
        role: "Cheapest embedding + chat path — Gemini free tier with generous daily quota.",
      },
      {
        slug: "qdrant-cloud-free",
        role: "Free vector store — 1GB is enough for ~200k chunks of real docs.",
      },
      {
        slug: "groq-developer-free-tier",
        role: "Sub-second Llama inference when you need a faster second model.",
      },
      {
        slug: "vercel-for-startups",
        role: "Deploy the Next.js front-end; free tier covers the demo phase.",
      },
      {
        slug: "neon-for-startups",
        role: "Postgres for chat history + auth — branching makes prompt-eval easy.",
      },
    ],
  },
  {
    slug: "voice-agent-mvp",
    label: "Voice agent MVP",
    tagline: "Phone-first AI agent on a solo-founder budget.",
    blurb:
      "Telephony + STT + LLM + TTS, each on its own free or credit tier. Enough for a working demo you can hand a prospect in week one.",
    picks: [
      {
        slug: "livekit-for-startups",
        role: "WebRTC + telephony stack with startup credits for real calls.",
      },
      {
        slug: "deepgram-startup-program",
        role: "Speech-to-text credits; their streaming latency beats generic providers.",
      },
      {
        slug: "elevenlabs-for-startups",
        role: "TTS that doesn't sound robotic — demo-ready voices in hours.",
      },
      {
        slug: "groq-developer-free-tier",
        role: "Low-latency LLM path; voice apps die on round-trip time.",
      },
      {
        slug: "modal-startup-credits",
        role: "Run the orchestrator as serverless GPU — scale to zero between calls.",
      },
    ],
  },
  {
    slug: "ai-coding-agent",
    label: "AI coding agent",
    tagline: "A coding copilot powered by your own prompts and models.",
    blurb:
      "If you're building the next Cursor, you need fast inference, long context, and evaluation infra. These five get you to a working internal agent before the Anthropic credits run out.",
    picks: [
      {
        slug: "anthropic-for-startups",
        role: "Claude credits — still the strongest coding model; apply early.",
      },
      {
        slug: "openai-free-evaluation-credits",
        role: "GPT evals for A/B testing your prompt changes.",
      },
      {
        slug: "langsmith-for-startups",
        role: "Trace + evaluate prompts — saves you from flying blind on regressions.",
      },
      {
        slug: "cursor-for-builders",
        role: "Use it to build it — solo devs ship 3× faster with a tight IDE loop.",
      },
      {
        slug: "modal-startup-credits",
        role: "Run sandboxed code execution in containers; the agent needs somewhere safe to run.",
      },
    ],
  },
  {
    slug: "b2b-internal-automation",
    label: "B2B internal automation",
    tagline: "Automate a real workflow inside a real company — no VC story needed.",
    blurb:
      "Most solo-founder revenue in 2026 comes from selling AI automations into mid-market ops teams. These five cover the data, the LLM, and the deploy target.",
    picks: [
      {
        slug: "microsoft-for-startups-founders-hub",
        role: "OpenAI-on-Azure credits + enterprise-friendly compliance story.",
      },
      {
        slug: "anthropic-for-startups",
        role: "Claude for the long-context document reasoning step.",
      },
      {
        slug: "neon-for-startups",
        role: "Postgres for the audit trail every enterprise buyer will ask about.",
      },
      {
        slug: "posthog-for-startups",
        role: "Product analytics + session replay — the fastest demo-to-decision path.",
      },
      {
        slug: "linear-for-startups",
        role: "Issue tracking you'll actually stick with past the first customer.",
      },
    ],
  },
  {
    slug: "weekend-image-app",
    label: "Weekend image app",
    tagline: "Ship an image-generation SaaS in a weekend, free tier only.",
    blurb:
      "Generation model + hosting + payments gate. Small-scope but lucrative if you pick a sharp vertical — headshots, interiors, product shots, etc.",
    picks: [
      {
        slug: "replicate-free-tier",
        role: "Pay-per-second image model hosting; no GPU ops required.",
      },
      {
        slug: "cloudflare-for-startups",
        role: "Edge + R2 object storage for cheap image delivery at any scale.",
      },
      {
        slug: "vercel-for-startups",
        role: "Next.js app deploy; image routes stream nicely from edge.",
      },
      {
        slug: "neon-for-startups",
        role: "Postgres to track generations per user before you wire up Stripe.",
      },
      {
        slug: "posthog-for-startups",
        role: "See which prompt templates convert free users to paid.",
      },
    ],
  },
  {
    slug: "agent-infra-heavy",
    label: "Agent infra (heavy)",
    tagline: "For founders going after long-horizon autonomous agents.",
    blurb:
      "If your agent runs for minutes and burns tokens, you need the largest credit pools plus real evaluation infra. This is the big-check stack — worth applying for in week one, even if approvals take 4–6 weeks.",
    picks: [
      {
        slug: "anthropic-for-startups",
        role: "Largest single-provider credit pool; Claude handles long tool chains best.",
      },
      {
        slug: "google-for-startups-cloud",
        role: "Up to $200k Google Cloud credits — the ceiling if you're running GPU workloads.",
      },
      {
        slug: "aws-activate",
        role: "Bedrock + S3 + everything-else; your enterprise customers will expect it.",
      },
      {
        slug: "langsmith-for-startups",
        role: "Agent trace replay is non-negotiable once chains exceed 5 steps.",
      },
      {
        slug: "modal-startup-credits",
        role: "Serverless GPU + sandboxed code exec — the agent's hands.",
      },
    ],
  },
];

export function getStackBySlug(slug: string): Stack | undefined {
  return STACKS.find((s) => s.slug === slug);
}
