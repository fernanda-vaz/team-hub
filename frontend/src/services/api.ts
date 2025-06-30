import type { Employee } from '../models/employee.model'

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
