// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// CRA only exposes env vars that start with REACT_APP_ (see CRA docs).
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

// Support both naming styles:
// - Supabase docs often show *PUBLISHABLE* keys now (sb_publishable_...)
// - Many older guides use ANON key naming
const supabaseKey =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

// Avoid throwing at import time (keeps tests/dev boot from hard-crashing).
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      [
        "Supabase is not configured.",
        "Set these env vars in .env or .env.local (project root) and restart `npm start`:",
        "- REACT_APP_SUPABASE_URL",
        "- REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or REACT_APP_SUPABASE_ANON_KEY)",
      ].join("\n"),
    );
  }
  return supabase;
}
