import { requireGuest } from '@/lib/auth-server'
import SignupForm from './signup-form'

export default async function SignupPage() {
  await requireGuest()
  
  return <SignupForm />
} 