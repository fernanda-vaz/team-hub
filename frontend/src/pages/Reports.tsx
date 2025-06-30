import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees } from '../features/employees/employeesSlice'
import type { AppDispatch, RootState } from '../app/store'
import type { Employee } from '../models/employee.model'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const getAge = (birthDate: string) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const getTenureInYears = (hireDate: string) => {
  const today = new Date()
  const hire = new Date(hireDate)
  const diffTime = Math.abs(today.getTime() - hire.getTime())
  return diffTime / (1000 * 60 * 60 * 24 * 365.25)
}

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    data: allEmployees,
    status,
    error,
  } = useSelector((state: RootState) => state.employees)

  const [departmentFilter, setDepartmentFilter] = useState<string>('todos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees())
    }
  }, [status, dispatch])

  const departmentOptions = useMemo(() => {
    if (!allEmployees) return []
    return [...new Set(allEmployees.map((emp) => emp.departamento))].sort()
  }, [allEmployees])

  const filteredEmployees = useMemo(() => {
    let employees: Employee[] = allEmployees || []
    if (statusFilter !== 'todos') {
      employees = employees.filter(
        (emp) => emp.ativo === (statusFilter === 'ativos')
      )
    }
    if (departmentFilter !== 'todos') {
      employees = employees.filter(
        (emp) => emp.departamento === departmentFilter
      )
    }
    return employees
  }, [allEmployees, departmentFilter, statusFilter])

  const genderData = useMemo(() => {
    if (!filteredEmployees) return []
    const counts = filteredEmployees.reduce((acc, emp) => {
      const gender = emp.sexo === 'feminino' ? 'Feminino' : 'Masculino'
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [filteredEmployees])

  const departmentData = useMemo(() => {
    if (!filteredEmployees) return []
    const counts = filteredEmployees.reduce((acc, emp) => {
      const dept = emp.departamento || 'N/A'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).map(([name, value]) => ({
      name,
      funcionários: value,
    }))
  }, [filteredEmployees])

  const ageData = useMemo(() => {
    if (!filteredEmployees) return []
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0,
    }
    filteredEmployees.forEach((emp) => {
      const age = getAge(emp.dataNascimento)
      if (age <= 25) ageGroups['18-25']++
      else if (age <= 35) ageGroups['26-35']++
      else if (age <= 45) ageGroups['36-45']++
      else if (age <= 55) ageGroups['46-55']++
      else ageGroups['56+']++
    })
    return Object.entries(ageGroups).map(([name, value]) => ({
      name,
      funcionários: value,
    }))
  }, [filteredEmployees])

  const tenureData = useMemo(() => {
    if (!filteredEmployees) return []
    const tenureGroups = {
      '< 1 ano': 0,
      '1-3 anos': 0,
      '3-5 anos': 0,
      '5+ anos': 0,
    }
    filteredEmployees.forEach((emp) => {
      const tenure = getTenureInYears(emp.dataContratacao)
      if (tenure < 1) tenureGroups['< 1 ano']++
      else if (tenure <= 3) tenureGroups['1-3 anos']++
      else if (tenure <= 5) tenureGroups['3-5 anos']++
      else tenureGroups['5+ anos']++
    })
    return Object.entries(tenureGroups).map(([name, value]) => ({
      name,
      funcionários: value,
    }))
  }, [filteredEmployees])

  if (status === 'loading') {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <p className='text-lg text-gray-600'>Carregando relatórios...</p>
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
    <div className='flex-1 bg-gray-100 p-6 md:p-8 min-h-screen'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className='bg-white rounded-2xl shadow-sm'>
          <div className='bg-indigo-600 shadow-sm px-6 py-4 rounded-t-2xl'>
            <h2 className='text-3xl font-bold text-white'>
              Relatórios Gerenciais
            </h2>
          </div>
          <div className='p-6'>
            <p className='text-gray-500 mt-1'>
              Analise os dados da sua equipe com os filtros abaixo.
            </p>
            <div className='mt-6 flex flex-col sm:flex-row gap-4 border-t border-gray-200 pt-4'>
              <div className='flex flex-col'>
                <label className='text-sm font-medium text-gray-700 mb-1'>
                  Departamento
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                >
                  <option value='todos'>Todos os Departamentos</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col'>
                <label className='text-sm font-medium text-gray-700 mb-1'>
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                >
                  <option value='todos'>Todos</option>
                  <option value='ativos'>Apenas Ativos</option>
                  <option value='inativos'>Apenas Inativos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Distribuição por Gênero
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {genderData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      fill='#8884d8'
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {genderData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={['#0088FE', '#FF8042'][index % 2]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} funcionário(s)`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className='text-center text-gray-500 pt-16'>
                  Sem dados para exibir.
                </p>
              )}
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Headcount por Departamento
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {departmentData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart
                    data={departmentData}
                    layout='vertical'
                    margin={{ left: 20, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis type='number' allowDecimals={false} />
                    <YAxis
                      type='category'
                      dataKey='name'
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }} />
                    <Legend />
                    <Bar dataKey='funcionários' fill='#82ca9d' />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className='text-center text-gray-500 pt-16'>
                  Sem dados para exibir.
                </p>
              )}
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Distribuição por Faixa Etária
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {ageData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='funcionários' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className='text-center text-gray-500 pt-16'>
                  Sem dados para exibir.
                </p>
              )}
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Distribuição por Tempo de Casa
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {tenureData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={tenureData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='funcionários' fill='#ffc658' />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className='text-center text-gray-500 pt-16'>
                  Sem dados para exibir.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
