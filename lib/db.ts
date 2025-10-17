import type { Player } from "./types"

const STORAGE_KEY = "alivetierlist_players"

let playersCache: Player[] = []

// Initialize from localStorage
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].stats?.UHC) {
        playersCache = parsed
      } else {
        // If old data format, clear and use defaults
        playersCache = getDefaultPlayers()
        saveToStorage()
      }
    } catch (e) {
      playersCache = getDefaultPlayers()
      saveToStorage()
    }
  } else {
    playersCache = getDefaultPlayers()
    saveToStorage()
  }
}

function getDefaultPlayers(): Player[] {
  return [
    {
      id: "1",
      name: "Marlowww",
      overallPoints: 5200,
      stats: {
        UHC: { tier: "HT5", points: 5200 },
        Crystal: { tier: "HT4", points: 4800 },
        Sword: { tier: "HT3", points: 4200 },
        Nethpot: { tier: "HT2", points: 3800 },
        SMP: { tier: "HT1", points: 3200 },
      },
    },
    {
      id: "2",
      name: "ItzRealMe",
      overallPoints: 5100,
      stats: {
        UHC: { tier: "HT4", points: 4800 },
        Crystal: { tier: "HT5", points: 5100 },
        Sword: { tier: "HT2", points: 3800 },
        Nethpot: { tier: "HT3", points: 4200 },
        SMP: { tier: "LT1", points: 2800 },
      },
    },
    {
      id: "3",
      name: "Swight",
      overallPoints: 4800,
      stats: {
        UHC: { tier: "HT3", points: 4200 },
        Crystal: { tier: "HT2", points: 3800 },
        Sword: { tier: "HT5", points: 4800 },
        Nethpot: { tier: "HT1", points: 3200 },
        SMP: { tier: "HT2", points: 3800 },
      },
    },
    {
      id: "4",
      name: "NetherKing",
      overallPoints: 4600,
      stats: {
        UHC: { tier: "HT2", points: 3800 },
        Crystal: { tier: "HT3", points: 4200 },
        Sword: { tier: "HT1", points: 3200 },
        Nethpot: { tier: "HT5", points: 4600 },
        SMP: { tier: "HT3", points: 4200 },
      },
    },
    {
      id: "5",
      name: "VoidWalker",
      overallPoints: 4200,
      stats: {
        UHC: { tier: "HT4", points: 4800 },
        Crystal: { tier: "LT1", points: 2800 },
        Sword: { tier: "LT2", points: 3200 },
        Nethpot: { tier: "LT1", points: 2800 },
        SMP: { tier: "HT2", points: 3800 },
      },
    },
    {
      id: "6",
      name: "PhantomSlayer",
      overallPoints: 3800,
      stats: {
        UHC: { tier: "LT3", points: 3800 },
        Crystal: { tier: "LT2", points: 3200 },
        Sword: { tier: "LT1", points: 2800 },
        Nethpot: { tier: "LT2", points: 3200 },
        SMP: { tier: "LT1", points: 2800 },
      },
    },
    {
      id: "7",
      name: "IceBreaker",
      overallPoints: 3200,
      stats: {
        UHC: { tier: "LT2", points: 3200 },
        Crystal: { tier: "LT1", points: 2800 },
        Sword: { tier: "LT3", points: 3800 },
        Nethpot: { tier: "N/A", points: 0 },
        SMP: { tier: "LT2", points: 3200 },
      },
    },
    {
      id: "8",
      name: "FireDancer",
      overallPoints: 3100,
      stats: {
        UHC: { tier: "LT1", points: 2800 },
        Crystal: { tier: "LT2", points: 3200 },
        Sword: { tier: "N/A", points: 0 },
        Nethpot: { tier: "LT2", points: 3200 },
        SMP: { tier: "LT1", points: 2800 },
      },
    },
  ]
}

export function getAllPlayers(): Player[] {
  if (typeof window === "undefined") {
    return getDefaultPlayers()
  }
  return playersCache
}

export function getTopPlayers(limit = 5): Player[] {
  return getAllPlayers()
    .sort((a, b) => b.overallPoints - a.overallPoints)
    .slice(0, limit)
}

export function getPlayersByGameMode(gameMode: string): Player[] {
  return getAllPlayers()
    .filter((p) => p.stats[gameMode as keyof typeof p.stats]?.tier !== "N/A")
    .sort((a, b) => {
      const aPoints = a.stats[gameMode as keyof typeof a.stats]?.points || 0
      const bPoints = b.stats[gameMode as keyof typeof b.stats]?.points || 0
      return bPoints - aPoints
    })
}

export function searchPlayers(query: string): Player[] {
  const lowerQuery = query.toLowerCase()
  return getAllPlayers().filter((p) => p.name.toLowerCase().includes(lowerQuery))
}

export function getPlayerById(id: string): Player | null {
  return getAllPlayers().find((p) => p.id === id) || null
}

export function addPlayer(player: Omit<Player, "id">): Player {
  const newPlayer: Player = {
    ...player,
    id: Date.now().toString(),
  }
  playersCache.push(newPlayer)
  saveToStorage()
  return newPlayer
}

export function updatePlayer(id: string, updates: Partial<Player>): Player | null {
  const index = playersCache.findIndex((p) => p.id === id)
  if (index === -1) return null

  playersCache[index] = { ...playersCache[index], ...updates }
  saveToStorage()
  return playersCache[index]
}

export function deletePlayer(id: string): boolean {
  const index = playersCache.findIndex((p) => p.id === id)
  if (index === -1) return false

  playersCache.splice(index, 1)
  saveToStorage()
  return true
}

function saveToStorage() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playersCache))
  }
}
