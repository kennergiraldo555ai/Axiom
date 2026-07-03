import { createClient } from "./supabase/server";

export async function getSession() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
