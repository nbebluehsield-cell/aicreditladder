import { getUser, isAdmin } from "@/lib/auth";
import { HeaderMasthead } from "./HeaderNav";

/**
 * Three-item masthead nav. The homepage ledger IS the "Browse" surface,
 * so we drop that item; readers sign in or go to newsletter/method.
 * Labels are short and declarative — trusted publications don't
 * ask "how we check", they just say "Method".
 */
const NAV = [
  { href: "/newsletter", label: "Weekly" },
  { href: "/methodology", label: "Method" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const user = await getUser();
  const admin = user ? await isAdmin() : false;

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--rule)] bg-[color:var(--background)]/95 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1560px] page-gutter-x pb-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pb-4 sm:pt-[max(1rem,env(safe-area-inset-top,0px))]">
        <HeaderMasthead
          nav={NAV}
          userEmail={user?.email ?? null}
          isAdmin={admin}
        />
      </div>
    </header>
  );
}
