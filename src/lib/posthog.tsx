'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    capture_pageview: false, // We'll manually capture pageviews
    capture_pageleave: true,
    defaults: "2026-01-30",
    person_profiles: "always",
  })
}

// Component to auto-capture pageviews
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return null
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  )
}
