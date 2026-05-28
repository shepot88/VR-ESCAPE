import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aumoiucfasixxayevfsn.supabase.co";

const supabaseKey =
  "sb_publishable_h2_46fvtul7b1HfhCO7KLA_p0nDclkX";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);