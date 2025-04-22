import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ResetSuccessPage() {
  return (
    <div className="bg-white rounded-lg p-8 shadow-md text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold mb-4">¡Contraseña restablecida!</h1>

      <p className="text-gray-600 mb-6">
        Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
      </p>

      <Link href="/login">
        <Button className="bg-blue-500 hover:bg-blue-600">Ir al inicio de sesión</Button>
      </Link>
    </div>
  )
}
