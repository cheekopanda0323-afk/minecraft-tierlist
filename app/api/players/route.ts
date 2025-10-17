import { kv } from "@vercel/kv";

export async function GET() {
  const players = (await kv.get("players")) || [];
  return Response.json(players);
}

export async function POST(req: Request) {
  const newPlayer = await req.json();
  const players = (await kv.get("players")) || [];
  players.push(newPlayer);
  await kv.set("players", players);
  return Response.json({ success: true });
}
