import { EvousLoginForm } from "@/components/evous-login-form"
import { PoweredByEvous } from "@/components/powered-by-evous"

export default function Home() {
  return (
    <div className="bg-slate-50 dark:bg-background min-h-screen w-full flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <EvousLoginForm />
      </div>
      <div className="mt-8">
        <PoweredByEvous size="md" />
      </div>
    </div>
  )
}
