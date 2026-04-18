"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Admin-only mutations. Every action re-checks `isAdmin()` because
 * server actions can be invoked from anywhere that holds the action
 * reference — we must not rely on a parent layout's auth check.
 */

type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function markOfferVerified(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };

  const slug = String(formData.get("slug") ?? "");
  const confidenceRaw = formData.get("confidence");
  const confidence = confidenceRaw ? Number(confidenceRaw) : null;
  const snapshotUrl = String(formData.get("snapshot_url") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!slug) return { ok: false, error: "Missing slug." };
  if (
    confidence !== null &&
    (Number.isNaN(confidence) || confidence < 0 || confidence > 1)
  ) {
    return { ok: false, error: "Confidence must be between 0 and 1." };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ok: false,
      error:
        "Can't write to DB — SUPABASE_SERVICE_ROLE_KEY isn't configured. Run the migration and set the env var first.",
    };
  }

  try {
    const svc = createServiceClient();
    const { error } = await svc
      .from("offers")
      .update({
        last_verified_at: new Date().toISOString(),
        verification_confidence: confidence,
        source_snapshot_url: snapshotUrl,
      })
      .eq("slug", slug);
    if (error) return { ok: false, error: error.message };

    const { data: offer } = await svc
      .from("offers")
      .select("id")
      .eq("slug", slug)
      .single();

    if (offer) {
      await svc.from("verification_runs").insert({
        offer_id: offer.id,
        outcome: "verified",
        notes,
        source_url: snapshotUrl,
      });
    }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Update failed.",
    };
  }

  revalidatePath(`/admin/offers/${slug}`);
  revalidatePath("/admin/offers");
  revalidatePath("/admin");
  revalidatePath(`/offers/${slug}`);
  revalidatePath("/explore");
  revalidatePath("/");

  return { ok: true, message: `Marked ${slug} verified.` };
}

export async function markOfferStale(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { ok: false, error: "Missing slug." };

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured." };
  }

  try {
    const svc = createServiceClient();
    const { error } = await svc
      .from("offers")
      .update({ status: "unclear" })
      .eq("slug", slug);
    if (error) return { ok: false, error: error.message };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Update failed.",
    };
  }

  revalidatePath(`/admin/offers/${slug}`);
  revalidatePath("/admin/offers");
  return { ok: true, message: `Marked ${slug} stale.` };
}
