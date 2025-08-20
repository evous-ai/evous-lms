import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES } from "@/lib/constants"
import { Globe } from "lucide-react"

interface CountrySelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function CountrySelect({ 
  value, 
  onValueChange, 
  placeholder = "Selecione seu país",
  required = false,
  disabled = false,
  className = ""
}: CountrySelectProps) {
  return (
    <div className="relative">
      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Select 
        value={value} 
        onValueChange={onValueChange} 
        required={required}
        disabled={disabled}
      >
        <SelectTrigger className={`pl-10 w-full ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
