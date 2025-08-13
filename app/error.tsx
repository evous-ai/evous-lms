"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Algo deu errado!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ocorreu um erro inesperado. Tente novamente.
          </p>
        </div>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
} 