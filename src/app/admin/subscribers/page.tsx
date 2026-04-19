import { Container } from "@/components/Container";
import { createServiceClient } from "@/lib/supabase/service";

export const metadata = { title: "Subscribers — Admin" };

type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  consented_at: string;
  unsubscribed_at: string | null;
};

async function loadSubscribers(): Promise<{
  ok: true;
  rows: Subscriber[];
} | { ok: false; error: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ok: false,
      error:
        "SUPABASE_SERVICE_ROLE_KEY is not configured yet. Add it to .env.local and run the migration to start capturing subscribers.",
    };
  }
  try {
    const svc = createServiceClient();
    const { data, error } = await svc
      .from("newsletter_subscribers")
      .select("id,email,source,consented_at,unsubscribed_at")
      .order("consented_at", { ascending: false })
      .limit(500);
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: (data ?? []) as Subscriber[] };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error.",
    };
  }
}

export default async function AdminSubscribers() {
  const result = await loadSubscribers();

  return (
    <Container className="py-10 sm:py-14">
      <p className="section-number mb-3">Subscribers</p>
      <h1 className="display-h2">Digest list.</h1>

      {!result.ok ? (
        <div className="mt-8 rounded-md border border-[color:var(--rule-2)] bg-[color:var(--surface)] p-5 text-[13px] text-[color:var(--muted)]">
          {result.error}
        </div>
      ) : result.rows.length === 0 ? (
        <p className="mt-8 text-[13px] text-[color:var(--muted)]">
          No subscribers yet.
        </p>
      ) : (
        <table className="mt-8 w-full border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-[color:var(--rule-2)] text-[color:var(--muted)]">
              <th className="mono py-3 pr-4 text-[10.5px] font-normal uppercase tracking-[0.18em]">
                Email
              </th>
              <th className="mono py-3 pr-4 text-[10.5px] font-normal uppercase tracking-[0.18em]">
                Source
              </th>
              <th className="mono py-3 pr-4 text-[10.5px] font-normal uppercase tracking-[0.18em]">
                Consented
              </th>
              <th className="mono py-3 pr-4 text-[10.5px] font-normal uppercase tracking-[0.18em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r) => (
              <tr key={r.id} className="border-b border-[color:var(--rule)]">
                <td className="py-2.5 pr-4 font-mono">{r.email}</td>
                <td className="py-2.5 pr-4 text-[color:var(--muted)]">{r.source ?? "—"}</td>
                <td className="py-2.5 pr-4 text-[color:var(--muted)]">
                  {new Date(r.consented_at).toISOString().slice(0, 10)}
                </td>
                <td className="py-2.5 pr-4">
                  {r.unsubscribed_at ? (
                    <span className="text-[color:var(--muted)]">Unsubscribed</span>
                  ) : (
                    <span className="text-[color:var(--teal)]">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
}
