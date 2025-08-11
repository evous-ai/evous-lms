import Image from "next/image"
import { EvousLoginForm } from "@/components/evous-login-form"

export default function Home() {
  return (
    <div className="bg-teal-950 min-h-screen w-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex items-center justify-center">
          <Image
            src="/evous_logo.svg"
            alt="Evous Logo"
            width={120}
            height={40}
            className="dark:hidden"
          />
          <Image
            src="/evous_logo_light.svg"
            alt="Evous Logo"
            width={120}
            height={40}
            className="hidden dark:block"
          />
        </div>
        <EvousLoginForm />
      </div>
    </div>
  )
}
