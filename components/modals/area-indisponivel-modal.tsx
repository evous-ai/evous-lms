"use client"

import { AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AreaIndisponivelModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AreaIndisponivelModal({ isOpen, onClose }: AreaIndisponivelModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Funcionalidade em Desenvolvimento
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Esta área ainda não está disponível
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogAction onClick={onClose} className="ml-auto">
          Entendi
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
} 