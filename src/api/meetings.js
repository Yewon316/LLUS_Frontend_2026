// src/api/meetings.js
import { supabase } from "../lib/supabaseClient";

const TABLE = "meetings";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);

  if (typeof tags === "string") {
    const trimmed = tags.trim();
    // Allow JSON array strings: ["a","b"]
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
      } catch (_) {
        // fall through to comma-split
      }
    }
    // Allow comma-separated strings: "a, b, c"
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeMembers(members) {
  if (members == null) return "";
  if (typeof members === "number" && Number.isFinite(members))
    return `${members} members`;
  return String(members);
}

export function normalizeMeetingRow(row) {
  // Support either "desc" or "description" depending on DB schema choice.
  const desc = row?.desc ?? row?.description ?? "";

  return {
    id: row?.id != null ? String(row.id) : "",
    category: row?.category ?? "",
    title: row?.title ?? "",
    desc,
    tags: normalizeTags(row?.tags),
    mode: row?.mode ?? "",
    schedule: row?.schedule ?? "",
    members: normalizeMembers(row?.members),
    created_at: row?.created_at ?? null,
  };
}

/**
 * Fetch meetings for the home page (replacement for hardcoded POPULAR_MEETINGS).
 * If your table grows, add pagination (range()) later.
 */
export async function fetchMeetings({ limit = 100 } = {}) {
  // Basic "select all rows"
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("id", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map(normalizeMeetingRow).filter((m) => m.id);
}

export async function fetchMeetingById(id) {
  const normalizedId = String(id ?? "").trim();

  // Demo cards still use ids like "p1" or "h2", so only query Supabase for UUID ids.
  if (!normalizedId || !UUID_RE.test(normalizedId)) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", normalizedId)
    .maybeSingle();

  if (error) throw error;

  return data ? normalizeMeetingRow(data) : null;
}
