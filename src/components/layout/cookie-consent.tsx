"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRightIcon, Settings2Icon, ShieldCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "nuvexora:cookie-consent"

type CookiePreferences = {
  essential: boolean
  analytics: boolean
  marketing: boolean
  personalization: boolean
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
}

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [preferences, setPreferences] = useState(defaultPreferences)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    setIsVisible(stored === null)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookiePreferences
        setPreferences((current) => ({ ...current, ...parsed, essential: true }))
      } catch {
        setPreferences(defaultPreferences)
      }
    }
  }, [])

  const save = (value: "accepted" | "rejected" | CookiePreferences) => {
    window.localStorage.setItem(STORAGE_KEY, typeof value === "string" ? value : JSON.stringify(value))
    setIsVisible(false)
  }

  const preferenceItems: Array<{ key: keyof CookiePreferences; label: string; description: string }> = [
    { key: "analytics", label: "Analytics", description: "Understand how the site is used." },
    { key: "marketing", label: "Marketing", description: "Personalize outreach and campaigns." },
    { key: "personalization", label: "Personalization", description: "Remember preferences across visits." },
  ]

  return (
    <>
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-x-4 bottom-4 z-80 mx-auto max-w-3xl rounded-[1.5rem] border border-border bg-card/90 dark:bg-slate-900/90 p-4 shadow-floating backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-auto"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-primary" aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">Cookie preferences</p>
                </div>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  We use cookies to improve performance, personalize experiences, and measure engagement. You can accept, reject, or manage preferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => save("rejected")}>
                  Reject
                </Button>
                <Sheet>
                  <SheetTrigger render={<Button variant="ghost" size="sm" className="gap-1.5" />}>
                    <Settings2Icon className="size-4" aria-hidden="true" />
                    Manage
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[min(92vw,28rem)] bg-background dark:bg-slate-950 text-foreground">
                    <div className="space-y-6 p-5 pt-16">
                      <SheetHeader className="p-0">
                        <SheetTitle>Cookie preferences</SheetTitle>
                        <SheetDescription>
                          Choose which categories you want to allow. Essential cookies are always enabled.
                        </SheetDescription>
                      </SheetHeader>

                      <div className="space-y-4">
                        {preferenceItems.map((item) => (
                          <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-hover">
                            <input
                              type="checkbox"
                              checked={preferences[item.key]}
                              onChange={(event) => setPreferences((current) => ({ ...current, [item.key]: event.target.checked }))}
                              className="mt-1 size-4 rounded border-border text-primary focus:ring-4 focus:ring-primary/12"
                            />
                            <span className="space-y-1">
                              <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                              <span className="block text-sm text-muted-foreground">{item.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button type="button" className="flex-1" onClick={() => save(preferences)}>
                          Save preferences
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <Button type="button" onClick={() => save("accepted")} className="gap-1.5">
                  Accept
                  <ChevronRightIcon className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export { CookieConsent }
