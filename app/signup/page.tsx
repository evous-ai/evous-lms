import { requireGuest } from '@/lib/auth'
import SignupForm from './signup-form'

export default async function SignupPage() {
  // Verifica se o usuário já está autenticado
  // Se estiver, redireciona para o dashboard
  await requireGuest()

  return <SignupForm />
} 