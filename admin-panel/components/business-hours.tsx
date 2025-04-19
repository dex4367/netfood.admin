"use client"

import { useState } from "react"
import { Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const weekdays = [
  { id: 1, name: "Segunda-feira" },
  { id: 2, name: "Terça-feira" },
  { id: 3, name: "Quarta-feira" },
  { id: 4, name: "Quinta-feira" },
  { id: 5, name: "Sexta-feira" },
  { id: 6, name: "Sábado" },
  { id: 7, name: "Domingo" },
]

interface BusinessHour {
  id: number
  day: number
  open: boolean
  periods: { id: number; start: string; end: string }[]
}

export function BusinessHours() {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([
    {
      id: 1,
      day: 1,
      open: true,
      periods: [{ id: 1, start: "08:00", end: "18:00" }],
    },
    {
      id: 2,
      day: 2,
      open: true,
      periods: [{ id: 1, start: "08:00", end: "18:00" }],
    },
    {
      id: 3,
      day: 3,
      open: true,
      periods: [{ id: 1, start: "08:00", end: "18:00" }],
    },
    {
      id: 4,
      day: 4,
      open: true,
      periods: [{ id: 1, start: "08:00", end: "18:00" }],
    },
    {
      id: 5,
      day: 5,
      open: true,
      periods: [{ id: 1, start: "08:00", end: "18:00" }],
    },
    {
      id: 6,
      day: 6,
      open: true,
      periods: [{ id: 1, start: "08:00", end: "14:00" }],
    },
    {
      id: 7,
      day: 7,
      open: false,
      periods: [],
    },
  ])

  const toggleDayOpen = (dayId: number, open: boolean) => {
    setBusinessHours((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              open,
              periods: open && day.periods.length === 0 ? [{ id: 1, start: "08:00", end: "18:00" }] : day.periods,
            }
          : day,
      ),
    )
  }

  const updatePeriod = (dayId: number, periodId: number, field: "start" | "end", value: string) => {
    setBusinessHours((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              periods: day.periods.map((period) => (period.id === periodId ? { ...period, [field]: value } : period)),
            }
          : day,
      ),
    )
  }

  const addPeriod = (dayId: number) => {
    setBusinessHours((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              periods: [
                ...day.periods,
                {
                  id: Math.max(0, ...day.periods.map((p) => p.id)) + 1,
                  start: "08:00",
                  end: "18:00",
                },
              ],
            }
          : day,
      ),
    )
  }

  const removePeriod = (dayId: number, periodId: number) => {
    setBusinessHours((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              periods: day.periods.filter((period) => period.id !== periodId),
            }
          : day,
      ),
    )
  }

  return (
    <div className="space-y-4">
      {businessHours.map((day) => {
        const weekday = weekdays.find((w) => w.id === day.day)

        return (
          <div key={day.id} className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id={`day-${day.id}`}
                  checked={day.open}
                  onCheckedChange={(checked) => toggleDayOpen(day.id, checked)}
                />
                <Label htmlFor={`day-${day.id}`} className="font-medium">
                  {weekday?.name}
                </Label>
              </div>
              {day.open && (
                <Button type="button" variant="outline" size="sm" onClick={() => addPeriod(day.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Horário
                </Button>
              )}
            </div>

            {day.open && (
              <div className="mt-4 space-y-2">
                {day.periods.map((period) => (
                  <div key={period.id} className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={period.start}
                      onChange={(e) => updatePeriod(day.id, period.id, "start", e.target.value)}
                      className="w-32"
                    />
                    <span>até</span>
                    <Input
                      type="time"
                      value={period.end}
                      onChange={(e) => updatePeriod(day.id, period.id, "end", e.target.value)}
                      className="w-32"
                    />
                    {day.periods.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removePeriod(day.id, period.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
