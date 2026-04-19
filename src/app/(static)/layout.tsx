import { Container } from "@/components/Container";

export default function StaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 border-t border-[color:var(--rule)]">
      <Container className="max-w-3xl py-10 sm:py-14 lg:py-16">
        {children}
      </Container>
    </div>
  );
}
