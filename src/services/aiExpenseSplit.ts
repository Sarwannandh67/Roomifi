/**
 * aiExpenseSplit.ts - EMERGENCY RECOVERY VERSION
 * Optimized for 5 RPM / Low-Token Free Tier accounts.
 */

export type ExpenseHistoryItem = {
  description: string;
  amount: number;
  category: string;
  paidBy: string;
  splitWith: { name: string; amount: number }[];
};

export type AiSplitSuggestion = {
  category: string;
  splits: { name: string; amount: number }[];
  explanation: string;
  anomalies: string[];
};

type SuggestAiSplitParams = {
  description: string;
  amount: number;
  paidBy: string;
  memberNames: string[];
  categoryOptions: string[];
  history: ExpenseHistoryItem[];
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const roundToCents = (value: number) => Math.round(value * 100) / 100;

const normalizeSplitsToTotal = (splits: { name: string; amount: number }[], total: number) => {
  const rounded = splits.map((s) => ({ ...s, amount: roundToCents(s.amount) }));
  const sum = roundToCents(rounded.reduce((acc, s) => acc + s.amount, 0));
  const diff = roundToCents(total - sum);
  if (rounded.length === 0 || diff === 0) return rounded;
  const idx = rounded.reduce((best, s, i) => s.amount > rounded[best].amount ? i : best, 0);
  rounded[idx].amount = roundToCents(rounded[idx].amount + diff);
  return rounded;
};

const callGemini = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) throw new Error("API Key missing.");

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 150, // Keep it tiny to prevent truncation
        response_mime_type: "application/json",
      },
    }),
  });

  if (response.status === 429) throw new Error("Busy. Wait 30s.");
  if (!response.ok) throw new Error(`API Error ${response.status}`);

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

export const suggestAiExpenseSplit = async (params: SuggestAiSplitParams): Promise<AiSplitSuggestion> => {
  // ULTRA-COMPRESSED PROMPT: No explanations, no history, just the split.
  const prompt = `JSON split ₹${params.amount} for "${params.description}". Members: ${params.memberNames.join(",")}. Schema: {"category":"string","splits":[{"name":"string","amount":number}]}`;

  try {
    const rawResponse = await callGemini(prompt);
    const cleaned = rawResponse.trim();

    // FAIL-SAFE: If response is incomplete or just a '{', jump to fallback immediately
    if (cleaned.length < 10 || !cleaned.endsWith("}")) {
      throw new Error("Truncated");
    }

    const parsed = JSON.parse(cleaned);
    let splits = params.memberNames.map(name => ({
      name,
      amount: Number(parsed.splits?.find((s: any) => s.name === name)?.amount) || 0
    }));

    return {
      category: params.categoryOptions.includes(parsed.category) ? parsed.category : "other",
      splits: normalizeSplitsToTotal(splits, params.amount),
      explanation: "AI-optimized split applied.",
      anomalies: [],
    };

  } catch (err) {
    console.warn("AI Truncated or Busy. Applying Equal Split Fallback.");
    // FALLBACK: If the AI fails, we manually calculate an equal split so the app doesn't break
    const equalAmount = roundToCents(params.amount / params.memberNames.length);
    const fallbackSplits = params.memberNames.map(name => ({ name, amount: equalAmount }));

    return {
      category: params.categoryOptions[0] || "other",
      splits: normalizeSplitsToTotal(fallbackSplits, params.amount),
      explanation: "AI was busy. Applied an equal split automatically.",
      anomalies: [],
    };
  }
};