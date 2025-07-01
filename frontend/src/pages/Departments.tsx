import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees } from '../features/employees/employeesSlice'
import type { Employee } from '../models/employee.model'
import type { AppDispatch, RootState } from '../app/store'
import { DepartmentCard } from '../components/DepartmentsCard'
import { EditEmployeeModal } from '../components/EditEmployeeModal'

export default function DepartmentsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    data: employees,
    status,
    error,
  } = useSelector((state: RootState) => state.employees)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees())
    }
  }, [status, dispatch])

  const departmentsData = useMemo(() => {
    if (!employees) return []

    const groupedByDept = employees.reduce((acc, employee) => {
      const dept = employee.departamento || 'Sem Departamento'
      if (!acc[dept]) {
        acc[dept] = []
      }
      acc[dept].push(employee)
      return acc
    }, {} as Record<string, Employee[]>)

    return Object.entries(groupedByDept)
      .map(([departmentName, employeesInDept]) => ({
        departmentName,
        employees: employeesInDept,
      }))
      .sort((a, b) => a.departmentName.localeCompare(b.departmentName))
  }, [employees])

  if (status === 'loading') {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <p className='text-lg text-gray-600'>Carregando departamentos...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-red-50 p-4'>
        <p className='text-lg font-semibold text-red-600'>
          Erro ao carregar dados: {error}
        </p>
      </div>
    )
  }

  return (
    <>
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onCancel={() => setEditingEmployee(null)}
          onSuccess={() => setEditingEmployee(null)}
        />
      )}

      <div className='flex-1 bg-gray-100 p-6 md:p-8 min-h-screen'>
        <div className='max-w-7xl mx-auto space-y-8'>
          <div>
            <div className='bg-indigo-600 shadow-sm px-6 py-4 rounded-t-2xl'>
              <h2 className='text-2xl sm:text-3xl font-bold text-white'>
                Visão Geral por Departamentos
              </h2>
            </div>
            <p className='text-gray-500 mt-1'>
              Veja a distribuição dos seus colaboradores na empresa.
            </p>
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
            {departmentsData.map(({ departmentName, employees }) => (
              <DepartmentCard
                key={departmentName}
                departmentName={departmentName}
                employees={employees}
                onEditEmployee={(employee) => setEditingEmployee(employee)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
