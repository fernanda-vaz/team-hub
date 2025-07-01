import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ResponsiveContainer,
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
} from 'recharts'
import { fetchEmployees } from '../features/employees/employeesSlice'
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  UsersIcon,
} from '../components/ui/icons'
import type { AppDispatch, RootState } from '../app/store'

const getTodayDate = () => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
  }).format(new Date())
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    data: employees,
    status,
    error,
  } = useSelector((state: RootState) => state.employees)

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])

  const {
    kpiData,
    dadosPorDepartamento,
    novasContratacoes,
    ultimasAdmissoes,
    aniversariantesDoMes,
  } = useMemo(() => {
    if (!employees || employees.length === 0) {
      return {
        kpiData: {
          totalFuncionarios: 0,
          funcionariosAtivos: 0,
          totalDepartamentos: 0,
          aniversariosMes: 0,
        },
        dadosPorDepartamento: [],
        novasContratacoes: [],
        ultimasAdmissoes: [],
        aniversariantesDoMes: [],
      }
    }

    const today = new Date()
    const currentMonth = today.getMonth()
    const aniversariantesDoMes = employees.filter(
      (e) => new Date(e.dataNascimento).getMonth() === currentMonth
    )

    // 1. Calcula os KPIs
    const kpiData = {
      totalFuncionarios: employees.length,
      funcionariosAtivos: employees.filter((e) => e.ativo).length,
      totalDepartamentos: [...new Set(employees.map((e) => e.departamento))]
        .length,
      aniversariosMes: aniversariantesDoMes.length,
    }

    // 2. Agrupa funcionários por departamento
    const deptoCounts = employees.reduce((acc, employee) => {
      acc[employee.departamento] = (acc[employee.departamento] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const dadosPorDepartamento = Object.entries(deptoCounts).map(
      ([name, value]) => ({ name, value })
    )

    // 3. Calcula as novas contratações dos últimos 6 meses
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1)
    const hiresByMonth = Array.from({ length: 6 })
      .map((_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const monthName = new Intl.DateTimeFormat('pt-BR', {
          month: 'short',
        }).format(d)
        return {
          name:
            monthName.charAt(0).toUpperCase() +
            monthName.slice(1).replace('.', ''),
          contratados: 0,
          year: d.getFullYear(),
          month: d.getMonth(),
        }
      })
      .reverse()

    employees.forEach((employee) => {
      const hireDate = new Date(employee.dataContratacao)
      if (hireDate >= sixMonthsAgo) {
        const hireMonth = hireDate.getMonth()
        const hireYear = hireDate.getFullYear()
        const monthData = hiresByMonth.find(
          (m) => m.month === hireMonth && m.year === hireYear
        )
        if (monthData) {
          monthData.contratados++
        }
      }
    })
    const novasContratacoes = hiresByMonth

    // 4. Obtém as 3 últimas admissões
    const ultimasAdmissoes = [...employees]
      .sort(
        (a, b) =>
          new Date(b.dataContratacao).getTime() -
          new Date(a.dataContratacao).getTime()
      )
      .slice(0, 3)

    return {
      kpiData,
      dadosPorDepartamento,
      novasContratacoes,
      ultimasAdmissoes,
      aniversariantesDoMes,
    }
  }, [employees])

  // --- RENDERIZAÇÃO CONDICIONAL ---
  if (status === 'loading') {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <p className='text-lg text-gray-600'>Carregando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-red-50 p-4'>
        <p className='text-lg font-semibold text-red-600'>
          Erro ao carregar dados: {error}
        </p>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']

  return (
    <main className='flex-1 bg-gray-100 p-6 md:p-8 overflow-y-auto'>
      <div className='max-w-7xl mx-auto'>
        {/* 1. Cabeçalho da Página */}
        <div className='mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Bem-vindo(a) de volta!
          </h1>
          <p className='text-gray-500 mt-1 capitalize'>{getTodayDate()}</p>
        </div>

        {/* 2. Widgets de Indicadores Rápidos (KPI Cards) */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
            <div className='bg-blue-100 p-3 rounded-full'>
              <UsersIcon />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'>
                {kpiData.totalFuncionarios}
              </p>
              <p className='text-sm text-gray-500'>Total de Funcionários</p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
            <div className='bg-green-100 p-3 rounded-full text-green-600'>
              <CheckCircleIcon />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'>
                {kpiData.funcionariosAtivos}
              </p>
              <p className='text-sm text-gray-500'>Colaboradores Ativos</p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
            <div className='bg-yellow-100 p-3 rounded-full text-yellow-600'>
              <BriefcaseIcon />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'>
                {kpiData.totalDepartamentos}
              </p>
              <p className='text-sm text-gray-500'>Departamentos</p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md flex items-center gap-4'>
            <div className='bg-pink-100 p-3 rounded-full text-pink-600'>
              <CalendarIcon />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'>
                {kpiData.aniversariosMes}
              </p>
              <p className='text-sm text-gray-500'>Aniversários no Mês</p>
            </div>
          </div>
        </div>

        {/* 3. Widgets de Visualização de Dados (Gráficos) */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow-md lg:col-span-2'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Funcionários por Departamento
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dadosPorDepartamento}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    innerRadius={60}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    nameKey='name'
                  >
                    {dadosPorDepartamento.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md lg:col-span-3'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Novas Contratações (Últimos 6 Meses)
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={novasContratacoes}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey='contratados'
                    fill='#8884d8'
                    name='Contratados'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. Widgets de Listas Rápidas */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Aniversariantes do Mês
            </h3>
            <ul className='space-y-4'>
              {aniversariantesDoMes.length > 0 ? (
                aniversariantesDoMes.map((p) => (
                  <li key={p._id} className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500'>
                      {p.nome.charAt(0)}
                    </div>
                    <div>
                      <p className='font-semibold text-gray-700'>{p.nome}</p>
                      <p className='text-sm text-gray-500'>
                        {new Date(p.dataNascimento).toLocaleDateString(
                          'pt-BR',
                          { day: '2-digit', month: 'long' }
                        )}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className='text-sm text-gray-500'>
                  Nenhum aniversariante este mês.
                </p>
              )}
            </ul>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='font-bold text-lg text-gray-800 mb-4'>
              Últimas Admissões
            </h3>
            <ul className='space-y-4'>
              {ultimasAdmissoes.map((p) => (
                <li key={p._id} className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500'>
                    {p.nome.charAt(0)}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-700'>{p.nome}</p>
                    <p className='text-sm text-gray-500'>
                      {p.cargo} -{' '}
                      {new Date(p.dataContratacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomePage
