"use client"

import { EvousLoginForm } from "@/components/evous-login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <EvousLoginForm />
        </div>
      </div>
    </div>
  )
}
