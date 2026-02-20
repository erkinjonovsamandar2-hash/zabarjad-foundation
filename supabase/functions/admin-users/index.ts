import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers: corsHeaders });

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!);
    const { data: { user } } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: corsHeaders });

    const { data: roleCheck } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").single();
    if (!roleCheck) return new Response(JSON.stringify({ error: "Not admin" }), { status: 403, headers: corsHeaders });

    const { action, email, user_id } = await req.json();

    if (action === "lookup") {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
      const found = data.users.find((u: { email?: string }) => u.email === email);
      if (!found) return new Response(JSON.stringify({ error: "Foydalanuvchi topilmadi" }), { status: 404, headers: corsHeaders });
      return new Response(JSON.stringify({ user_id: found.id, email: found.email }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add_admin") {
      const { error } = await supabase.from("user_roles").insert({ user_id, role: "admin" });
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "list_admins") {
      const { data: roles } = await supabase.from("user_roles").select("id, user_id, role").eq("role", "admin");
      const { data: users } = await supabase.auth.admin.listUsers();
      const admins = (roles || []).map((r: { id: string; user_id: string }) => {
        const u = users?.users.find((u: { id: string }) => u.id === r.user_id);
        return { id: r.id, user_id: r.user_id, email: u?.email || "noma'lum" };
      });
      return new Response(JSON.stringify(admins), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
