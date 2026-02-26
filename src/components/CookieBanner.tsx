'use client'

import { useEffect, useState } from 'react'
import { usePostHog } from 'posthog-js/react'

export function CookieBanner() {
  const posthog = usePostHog()
  const [consentGiven, setConsentGiven] = useState<string | null>(null)

  useEffect(() => {
    setConsentGiven(posthog.get_explicit_consent_status())
  }, [posthog])

  const handleAccept = () => {
    posthog.opt_in_capturing()
    setConsentGiven('granted')
  }

  const handleDecline = () => {
    posthog.opt_out_capturing()
    setConsentGiven('denied')
  }

  if (consentGiven === null || consentGiven !== 'pending') return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          We use cookies to understand how you use our site and to improve your
          experience. This includes analytics and session recording.{' '}
          <a
            href="/privacy-policy"
            className="text-teal-500 underline hover:no-underline dark:text-teal-400"
          >
            Privacy policy
          </a>
        </p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
