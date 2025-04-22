interface Contact {
  tipo: string
  nombre: string
  parentesco: string
  telefono: string
  rut: string
}

interface StudentProfileProps {
  student: {
    documentNumber: string
    birthDate: string
    gender: string
    cellphone: string
    email: string
    languages: string
    address: string
    contacts: {
      apoderados: Contact[]
      antecedentesClinicosContactos: Contact[]
      entrevistaFamiliarContactos: Contact[]
    }
  }
}

export function StudentProfile({ student }: StudentProfileProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Datos personales */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos personales</h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Número de documento:</span>
              <span className="text-gray-800">{student.documentNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Fecha de nacimiento:</span>
              <span className="text-gray-800">{student.birthDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Género:</span>
              <span className="text-gray-800">{student.gender}</span>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Información de contacto</h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Celular:</span>
              <span className="text-gray-800">{student.cellphone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Correo:</span>
              <span className="text-gray-800">{student.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Idioma:</span>
              <span className="text-gray-800">{student.languages}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Dirección:</span>
              <span className="text-gray-800">{student.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apoderados */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Apoderados</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-300">
                <th className="px-4 py-3 text-left font-medium text-white">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-white">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-white">Parentesco</th>
                <th className="px-4 py-3 text-left font-medium text-white">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-white">RUT/DNI</th>
              </tr>
            </thead>
            <tbody>
              {student.contacts.apoderados.map((contact, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{contact.tipo}</td>
                  <td className="px-4 py-3 text-sm">{contact.nombre}</td>
                  <td className="px-4 py-3 text-sm">{contact.parentesco}</td>
                  <td className="px-4 py-3 text-sm">{contact.telefono}</td>
                  <td className="px-4 py-3 text-sm">{contact.rut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Antecedentes clínicos */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Antecedentes clínicos</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-300">
                <th className="px-4 py-3 text-left font-medium text-white">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-white">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-white">Parentesco</th>
                <th className="px-4 py-3 text-left font-medium text-white">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-white">RUT/DNI</th>
              </tr>
            </thead>
            <tbody>
              {student.contacts.antecedentesClinicosContactos.map((contact, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{contact.tipo}</td>
                  <td className="px-4 py-3 text-sm">{contact.nombre}</td>
                  <td className="px-4 py-3 text-sm">{contact.parentesco}</td>
                  <td className="px-4 py-3 text-sm">{contact.telefono}</td>
                  <td className="px-4 py-3 text-sm">{contact.rut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entrevista familiar y otros antecedentes */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Entrevista familiar y otros antecedentes</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-300">
                <th className="px-4 py-3 text-left font-medium text-white">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-white">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-white">Parentesco</th>
                <th className="px-4 py-3 text-left font-medium text-white">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-white">RUT/DNI</th>
              </tr>
            </thead>
            <tbody>
              {student.contacts.entrevistaFamiliarContactos.map((contact, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{contact.tipo}</td>
                  <td className="px-4 py-3 text-sm">{contact.nombre}</td>
                  <td className="px-4 py-3 text-sm">{contact.parentesco}</td>
                  <td className="px-4 py-3 text-sm">{contact.telefono}</td>
                  <td className="px-4 py-3 text-sm">{contact.rut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
