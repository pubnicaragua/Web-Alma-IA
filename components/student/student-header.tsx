import Image from "next/image"

interface StudentHeaderProps {
  student: {
    name: string
    age: number
    birthDateFull: string
    status: string
    image: string
  }
}

export function StudentHeader({ student }: StudentHeaderProps) {
  return (
    <div className="flex items-center mb-6">
      <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
        <Image
          src={student.image || "/placeholder.svg"}
          alt={student.name}
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
        <p className="text-xl text-gray-600">
          {student.age} años {student.birthDateFull}
        </p>
      </div>
      <div className="ml-auto">
        <div
          className={`px-6 py-3 rounded-md text-white font-medium ${
            student.status === "Bien" ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          Estado: {student.status}
        </div>
      </div>
    </div>
  )
}
