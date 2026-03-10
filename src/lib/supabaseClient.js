import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bcettfsluqkihclclgpv.supabase.co";
const supabaseAnonKey = "sb_publishable_FZv8nWzPuRggi1GWjS4-UQ_yTNBXrnQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
