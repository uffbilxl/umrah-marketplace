import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const email = "demo@umrahsupermarket.co.uk";
    const password = "UmrahDemo2026!";

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u: any) => u.email === email);

    let userId: string;

    if (existing) {
      userId = existing.id;
    } else {
      const { data: newUser, error: signUpErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (signUpErr) throw signUpErr;
      userId = newUser.user.id;
    }

    // Upsert profile
    await supabase.from("profiles").upsert({
      id: userId,
      name: "Aisha Rahman",
      email,
      phone_number: "07700 900 123",
      preferred_store_location: "Leicester",
      points: 2450,
      tier: "Silver",
      created_at: "2026-01-15T09:00:00Z",
    }, { onConflict: "id" });

    // Seed purchases if none exist
    const { data: existingPurchases } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", userId);

    if (!existingPurchases || existingPurchases.length === 0) {
      const now = new Date();
      const threeWeeksAgo = new Date(now.getTime() - 21 * 86400000).toISOString();
      const oneWeekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      const yesterday = new Date(now.getTime() - 86400000).toISOString();

      // Order 1: 3 weeks ago, Leicester
      // Lamb Back Chops x2 = 17.98, Chicken Breast x1 = 6.49, Biryani Masala x3 = 4.47
      // Subtotal = 28.94, member discount on meat (5%): (17.98+6.49)*0.05 = 1.2235 => 1.22
      // Total = 28.94 - 1.22 = 27.72, points = 277
      const { data: p1 } = await supabase.from("purchases").insert({
        user_id: userId,
        total_spent: 27.72,
        points_earned: 277,
        store_location: "Leicester",
        date: threeWeeksAgo,
      }).select("id").single();

      // Order 2: 1 week ago, Liverpool
      // Chicken Samosas x2 = 33.98, Garlic Mayo x2 = 3.78, Zam Zam Water x4 = 7.96
      // Subtotal = 45.72, member discount: 33.98*0.05 = 1.70
      // Total = 45.72 - 1.70 - 5.00(redeemed) = 39.02, points = 390
      const { data: p2 } = await supabase.from("purchases").insert({
        user_id: userId,
        total_spent: 39.02,
        points_earned: 390,
        store_location: "Liverpool",
        date: oneWeekAgo,
      }).select("id").single();

      // Order 3: yesterday, Leicester
      // Whole Baby Chicken x1 = 5.50, Lamb Mince x2 = 15.98, Naan Bread x2 = 2.58, Rooh Afza x1 = 4.99
      // Subtotal = 29.05, member discount: (5.50+15.98)*0.05 = 1.074 => 1.07
      // Total = 29.05 - 1.07 = 27.98, points = 279
      const { data: p3 } = await supabase.from("purchases").insert({
        user_id: userId,
        total_spent: 27.98,
        points_earned: 279,
        store_location: "Leicester",
        date: yesterday,
      }).select("id").single();
    }

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
