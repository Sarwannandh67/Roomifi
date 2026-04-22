const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type RequestBody = {
  prompt?: string;
  model?: string;
};

const getEnv = (key: string) => {
  const deno = (globalThis as any).Deno;
  const value = deno?.env?.get?.(key);
  return typeof value === "string" ? value : undefined;
};

const defaultModel = getEnv("HF_MODEL") ?? "meta-llama/Meta-Llama-3-8B-Instruct";

const handler = async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const hfKey = getEnv("HF_KEY");
    if (!hfKey) {
      return new Response(JSON.stringify({ error: "Missing HF_KEY secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as RequestBody;
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";
    const model = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : defaultModel;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hfUrl = `https://api-inference.huggingface.co/models/${model}`;

    const res = await fetch(hfUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          { role: "system", content: "You are RoomiFi AI, an expense splitting assistant. Return ONLY valid JSON." },
          { role: "user", content: prompt },
        ].map(m => `${m.role}: ${m.content}`).join("\n"),
        parameters: {
          temperature: 0.2,
          max_new_tokens: 600,
        },
      }),
    });

    const data = await res.json();
    const text = Array.isArray(data) ? data[0]?.generated_text?.trim() : "";
    return new Response(JSON.stringify({ text, model, provider: "hf-inference" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("AI Request Error:", error);
    return new Response(JSON.stringify({ error: error?.message || "AI request failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

const denoServe = (globalThis as any).Deno?.serve;
if (typeof denoServe === "function") {
  denoServe(handler);
}

export default handler;

