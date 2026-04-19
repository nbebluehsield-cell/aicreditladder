import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { MagicLinkForm } from "@/components/MagicLinkForm";
import { getUser } from "@/lib/auth";
import { safeInternalPath } from "@/lib/safe-path";

export const metadata = {
  title: "Sign in",
  description:
    "Magic-link sign-in. Unlocks application tips, documents needed, common rejection reasons, and the weekly credits digest.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const user = await getUser();
  if (user) redirect("/explore");

  const sp = await searchParams;
  const rawNext = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const nextPath = safeInternalPath(rawNext);

  return (
    <div className="auth-signin-shell">
      <Container className="relative z-[1] max-w-sm text-center">
        <p className="section-number mb-5">Sign in</p>
        <h1 className="display-hero text-balance">
          Unlock the
          <br />
          <span className="italic-display text-[color:var(--gold)]">
            full depth.
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-[32ch] text-[15px] leading-[1.65] text-[color:var(--muted)]">
          One magic link to your email. No password. Unlocks application tips,
          documents needed, common rejection reasons, and the weekly digest.
        </p>

        <MagicLinkForm nextPath={nextPath} />
      </Container>
    </div>
  );
}
