import { requireGuest } from '@/lib/auth'
import { EvousLoginForm } from "@/components/evous-login-form"
import { PoweredByEvous } from "@/components/powered-by-evous"

export default async function HomePage() {
  // Verifica se o usuário já está autenticado
  // Se estiver, redireciona para o dashboard
  await requireGuest()

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
