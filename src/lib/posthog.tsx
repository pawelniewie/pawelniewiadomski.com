'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, Suspense } from 'react'
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

    // Session Replay
    session_recording: {
      recordCrossOriginIframes: false,
      maskAllInputs: true, // Privacy: mask all input fields by default
      maskTextSelector: '[data-ph-mask]', // Custom masking
      recordCanvas: false, // Set true if you have interactive canvas elements
      sampleRate: 1.0, // Record 100% of sessions (adjust to 0.1 for 10% sampling)
      minimumDuration: 2000, // Only record sessions > 2 seconds
    },

    // Autocapture clicks, form submissions, etc.
    autocapture: {
      dom_event_allowlist: ['click', 'change', 'submit'], // What to capture
      url_allowlist: [window.location.origin], // Only your domain
      element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea'],
      css_selector_allowlist: ['[ph-autocapture]'], // Custom attribute for specific elements
    },

    // Exception/Error tracking
    capture_exception_autocapture: true,

    // Performance monitoring
    capture_performance: true,
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
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  )
}
