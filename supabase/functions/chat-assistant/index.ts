import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the UMRAH Supermarket AI Assistant — a helpful, fast, and friendly chat helper embedded on the website.

TONE: Short, clear, direct. Friendly but professional. Use simple language. Prioritise speed and usefulness. Keep answers 1-3 lines max.

CAPABILITIES:
1. Product Navigation — help users find products by category (e.g. "Chicken is in Fresh Food → Meat & Poultry"). Suggest the closest category if unsure.
2. Website Guidance — help navigate: basket (top-right cart icon), checkout, offers/deals page, shop page, stores page, U Points loyalty page, profile/account page.
3. Search Assistance — suggest search terms, offer alternatives if item not found, recommend similar products.
4. Account & Orders — help with logging in, viewing past purchases, profile. For sensitive issues, direct to support.
5. Promotions & Loyalty — explain U Points loyalty scheme (earn points on purchases, redeem for vouchers). Mention current deals page.

WEBSITE STRUCTURE:
- Shop: /shop — browse all products by category
- Deals: /deals — current offers and discounts
- U Points: /upoints — loyalty points program
- Stores: /stores — store locations and hours
- About: /about — about the supermarket
- Basket: /cart — shopping basket (also icon in top-right)
- Profile: /profile — account, orders, settings
- Checkout: /checkout — complete your purchase

PRODUCT CATEGORIES: Fresh Food (Meat & Poultry, Fish & Seafood, Fruits & Vegetables), Dairy & Eggs, Bakery, Pantry & Dry Goods, Frozen, Beverages, Snacks & Confectionery, Halal-certified products.

RULES:
- Do NOT make up product availability or prices
- Do NOT handle payments
- Do NOT give incorrect store info
- If unsure say: "I'm not 100% sure, but I can help you find it."
- If user seems lost, guide step-by-step
- If vague, ask a quick clarifying question
- If repeated failure, suggest the search bar or category browsing
- Always aim to reduce clicks
- Use emojis sparingly (1-2 per message max)
- Never write long paragraphs`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I'm a bit busy right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
