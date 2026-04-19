import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { MagicLinkForm } from "@/components/MagicLinkForm";
import { getUser } from "@/lib/auth";

export const metadata = {
  title: "Sign in",
  description:
    "Magic-link sign-in. Unlocks application tips, documents needed, common rejection reasons, and the weekly credits digest.",
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/explore");

  return (
    <div className="flex flex-1 flex-col">
      <Container className="max-w-md py-24 sm:py-32">
        <p className="section-number mb-4">Sign in</p>
        <h1 className="display-hero">
          Unlock the
          <br />
          <span className="italic-display text-[color:var(--gold)]">
            full depth.
          </span>
        </h1>
        <p className="mt-7 text-[15px] leading-[1.6] text-[color:var(--muted)]">
          One magic link to your email. No password. Unlocks application tips,
          documents needed, common rejection reasons, and the weekly digest.
        </p>

        <MagicLinkForm />
      </Container>
    </div>
  );
}
