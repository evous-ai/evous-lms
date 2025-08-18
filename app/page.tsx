import { requireGuest } from '@/lib/auth'
import { EvousLoginForm } from '@/components/evous-login-form'

export default async function HomePage() {
  // Verifica se o usuário já está autenticado
  // Se estiver, redireciona para o dashboard
  await requireGuest()

  return <EvousLoginForm />
}
