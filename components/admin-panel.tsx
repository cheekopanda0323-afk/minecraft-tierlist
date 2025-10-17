"use client"

import { useState, useEffect } from "react"
import { getAllPlayers, addPlayer, updatePlayer, deletePlayer } from "@/lib/db"
import { type Player, TIERS, GAME_MODES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminPanel() {
  const [players, setPlayers] = useState<Player[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    gameMode: "SMP" as const,
    tier: "HT1" as const,
    points: 0,
  })

  useEffect(() => {
    setPlayers(getAllPlayers())
  }, [])

  const handleAddPlayer = () => {
    if (!formData.name.trim()) return

    if (editingId) {
      const player = players.find((p) => p.id === editingId)
      if (player) {
        const updatedStats = { ...player.stats }
        updatedStats[formData.gameMode] = {
          tier: formData.tier,
          points: formData.points,
        }
        updatePlayer(editingId, {
          stats: updatedStats,
          overallPoints: Math.max(...Object.values(updatedStats).map((s) => s.points)),
        })
      }
      setEditingId(null)
    } else {
      const newStats = {
        UHC: { tier: "N/A" as const, points: 0 },
        Crystal: { tier: "N/A" as const, points: 0 },
        Sword: { tier: "N/A" as const, points: 0 },
        Nethpot: { tier: "N/A" as const, points: 0 },
        SMP: { tier: "N/A" as const, points: 0 },
      }
      newStats[formData.gameMode] = {
        tier: formData.tier,
        points: formData.points,
      }
      addPlayer({
        name: formData.name,
        overallPoints: formData.points,
        stats: newStats,
      })
    }

    setFormData({ name: "", gameMode: "SMP", tier: "HT1", points: 0 })
    setPlayers(getAllPlayers())
  }

  const handleEdit = (player: Player) => {
    setEditingId(player.id)
    const firstGameMode = GAME_MODES[0]
    const stats = player.stats[firstGameMode]
    setFormData({
      name: player.name,
      gameMode: firstGameMode,
      tier: stats.tier,
      points: stats.points,
    })
  }

  const handleDelete = (id: string) => {
    deletePlayer(id)
    setPlayers(getAllPlayers())
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: "", gameMode: "SMP", tier: "HT1", points: 0 })
  }

  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-glow-red mb-8">Admin Panel</h1>

        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Player" : "Add New Player"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Player Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-secondary border-border text-foreground"
            />

            <Select
              value={formData.gameMode}
              onValueChange={(value: any) => setFormData({ ...formData, gameMode: value })}
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {GAME_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={formData.tier} onValueChange={(value: any) => setFormData({ ...formData, tier: value })}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Points"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleAddPlayer} className="bg-primary hover:bg-primary/90 glow-red-hover">
              {editingId ? "Update Player" : "Add Player"}
            </Button>
            {editingId && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Name</th>
                <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Overall Points</th>
                <th className="text-left py-4 px-6 text-muted-foreground font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-6 font-semibold">{player.name}</td>
                  <td className="py-4 px-6 text-primary">{player.overallPoints}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(player)}
                        className="bg-primary/20 text-primary hover:bg-primary/30"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(player.id)}
                        variant="outline"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
