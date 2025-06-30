import type { Employee } from '../models/employee.model'

type NewEmployee = Omit<Employee, '_id'>

const API_URL = import.meta.env.VITE_API_BASE_URL

export const getEmployeesFromApi = async (): Promise<Employee[]> => {
  const response = await fetch(`${API_URL}/employees`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.body || 'Falha ao buscar funcionários.')
  }

  const data = await response.json()

  return data.body
}

export const addEmployeeToApi = async (
  employeeData: NewEmployee
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.body || 'Falha ao adicionar funcionário.')
  }

  const data = await response.json()
  return data.body
}

export const updateEmployeeInApi = async (
  id: string,
  employeeData: Partial<NewEmployee>
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.body || 'Falha ao editar dados de funcionário.')
  }

  const data = await response.json()
  return data.body
}

export const deleteEmployeeFromApi = async (
  id: string
): Promise<{ _id: string }> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.body || 'Falha ao excluir funcionário.')
  }

  const data = await response.json()
  return data.body
}
