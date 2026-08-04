import { loadEnvConfig } from "@next/env";

async function verifySupabaseConnection() {
  try {
    loadEnvConfig(process.cwd());

    const { supabase } = await import("../lib/supabase");
    const { data, error } = await supabase.from("assets").select("*").limit(1);

    if (error) {
      if (error.code === "42P01" || error.code === "PGRST205") {
        console.info(
          "Supabase connection succeeded. The assets table does not exist yet.",
        );
        return;
      }

      console.error("Supabase connection check failed:", {
        code: error.code,
        message: error.message,
      });
      process.exitCode = 1;
      return;
    }

    console.info("Supabase connection succeeded. Assets query result:", data);
  } catch (error) {
    console.error(
      "Supabase client could not be initialized:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exitCode = 1;
  }
}

void verifySupabaseConnection();
