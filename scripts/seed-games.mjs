/**
 * Supabase Game Seeder
 *
 * Reads bgg-top2000.json and inserts games into the Supabase `games` table.
 * Uses the service role key to bypass RLS policies.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/seed-games.mjs
 *
 * Get your service role key from:
 *   Supabase Dashboard → Project Settings → API → service_role key
 *
 * Options (edit below):
 *   START_RANK  — only import games ranked >= this (default: 1)
 *   END_RANK    — only import games ranked <= this (default: 2000)
 *   CLEAR_FIRST — delete all existing games before inserting (default: false)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://tniuauoiloavlcwpfjkl.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const START_RANK  = 1;
const END_RANK    = 2000;
const CLEAR_FIRST = false;  // ⚠️ Set true to wipe existing games first
const BATCH_SIZE  = 100;

// ─── Main ─────────────────────────────────────────────────────────────────────
if (!SERVICE_ROLE_KEY) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.");
  console.error("Run: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/seed-games.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Load JSON
  let allGames;
  try {
    allGames = JSON.parse(readFileSync("scripts/bgg-top2000.json", "utf8"));
  } catch {
    console.error("Error: scripts/bgg-top2000.json not found.");
    console.error("Run import-bgg-top2000.mjs first.");
    process.exit(1);
  }

  const games = allGames.filter(
    (g) => g.bgg_rank >= START_RANK && g.bgg_rank <= END_RANK
  );
  console.log(`Loaded ${games.length} games (rank ${START_RANK}–${END_RANK})`);

  // Optionally clear existing games
  if (CLEAR_FIRST) {
    console.log("Clearing existing games...");
    const { error } = await supabase.from("games").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.error("Failed to clear:", error.message);
      process.exit(1);
    }
    console.log("Cleared.");
  }

  // Insert in batches
  let inserted = 0;
  let failed = 0;
  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const batch = games.slice(i, i + BATCH_SIZE);
    const rows = batch.map((g) => ({
      name:    g.name,
      name_en: g.name_en,
      name_de: g.name_de ?? null,
      icon:    g.icon,
    }));

    const { error } = await supabase.from("games").insert(rows);
    if (error) {
      console.error(`Batch ${i}–${i + batch.length} failed: ${error.message}`);
      failed += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r  Inserted ${inserted}/${games.length}...`);
    }
  }

  console.log(`\n\n=== Done! ===`);
  console.log(`Inserted: ${inserted}`);
  if (failed > 0) console.log(`Failed:   ${failed} (check Supabase RLS policies)`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
