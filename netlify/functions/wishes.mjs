import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("wishes");
  const h = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  let list = (await store.get("all", { type: "json" })) || [];
  if (req.method === "POST") {
    const b = await req.json().catch(() => ({}));
    const n = String(b.n || "A friend").trim().slice(0, 30);
    const m = String(b.m || "").trim().slice(0, 140);
    if (!m) return new Response(JSON.stringify({ error: "empty" }), { status: 400, headers: h });
    list.push({ n, m, t: Date.now() });
    list = list.slice(-200);
    await store.setJSON("all", list);
  }
  return new Response(JSON.stringify(list), { headers: h });
};

export const config = { path: "/api/wishes" };
