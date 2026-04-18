import { Container } from "@/components/Container";

export default function StaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <Container className="py-20 sm:py-28 max-w-3xl">{children}</Container>
    </main>
  );
}
