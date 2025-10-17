import type { Player } from "./types"

const API_URL = "/api/players"

// 🧠 Get all players from Vercel KV
export async function getAllPlayers(): Promise<Player[]> {
  const res = await fetch(API_URL, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

// ➕ Add a new player
export async function addPlayer(player: Omit<Player, "id">): Promise<void> {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  })
}
