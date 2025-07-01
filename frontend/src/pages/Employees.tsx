import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { useEffect, useState } from 'react'
import type { Employee } from '../models/employee.model'
import {
  fetchEmployees,
  setActiveFilter,
} from '../features/employees/employeesSlice'
import { EmployeeTableRow } from '../components/EmployeeTableRow'
import { AddEmployeeForm } from '../components/AddEmployeeForm'
import { EditEmployeeForm } from '../components/EditEmployeeForm'
import { EmployeeCard } from '../components/EmployeeCard'

export default function EmployeesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, filteredData, status } = useSelector(
    (state: RootState) => state.employees
  )
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees())
    }
  }, [dispatch, status])

  const activeCount = data.filter((emp) => emp.ativo).length
  const totalCount = data.length

  return (
    <div className='flex-1 bg-gray-200 min-h-screen w-full overflow-x-hidden p-4'>
      <div className='max-w-7xl mx-auto rounded-2xl bg-white shadow-sm mb-8'>
        {showAddForm ? (
          <AddEmployeeForm
            onCancel={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false)
              dispatch(fetchEmployees())
            }}
          />
        ) : editingEmployee ? (
          <EditEmployeeForm
            employee={editingEmployee}
            onCancel={() => setEditingEmployee(null)}
            onSuccess={() => {
              setEditingEmployee(null)
              dispatch(fetchEmployees())
            }}
          />
        ) : (
          <>
            <div className='bg-indigo-600 shadow-sm px-6 py-4 rounded-t-2xl'>
              <h2 className='text-2xl sm:text-3xl font-bold text-white'>
                Gerenciar Funcionários
              </h2>
            </div>

            <div className='p-6 space-y-6'>
              <div className='flex flex-col justify-between items-center md:items-start gap-4 p-4'>
                <div className='flex sm:items-center'>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className='w-full sm:w-auto h-16 px-10 py-2.5 border border-indigo-700 text-indigo-700 rounded-xl cursor-pointer hover:border-indigo-500 hover:text-indigo-500 text-center transition-colors duration-300'
                  >
                    + Adicionar Funcionário
                  </button>
                </div>

                <div className='flex flex-col md:flex-row items-center justify-between w-full gap-6 '>
                  <div className='flex flex-col md:flex-row mt-4 gap-6'>
                    <button
                      onClick={() => dispatch(setActiveFilter(true))}
                      className='px-10 py-2.5 border border-indigo-500 text-indigo-500 rounded-xl cursor-pointer hover:border-indigo-300 hover:text-indigo-300'
                    >
                      Ver apenas ativos
                    </button>

                    <button
                      onClick={() => dispatch(setActiveFilter(null))}
                      className='px-10 py-2.5 border border-slate-600 text-slate-600 rounded-xl cursor-pointer hover:border-slate-300 hover:text-slate-300'
                    >
                      Limpar filtros
                    </button>
                  </div>

                  <span className='text-slate-600'>
                    Ativos {activeCount}/{totalCount}
                  </span>
                </div>
              </div>

              <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
                <div className='overflow-x-auto'>
                  {status === 'loading' && (
                    <p className='p-6 text-center text-slate-500'>
                      Carregando funcionários...
                    </p>
                  )}

                  {status === 'succeeded' && (
                    <>
                      <div className='hidden md:block bg-white shadow-md rounded-lg overflow-hidden'>
                        <div className='overflow-x-auto'>
                          <table className='min-w-full divide-y divide-slate-200'>
                            <thead className='bg-gray-100'>
                              <tr>
                                <th
                                  scope='col'
                                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
                                >
                                  Funcionário
                                </th>

                                <th
                                  scope='col'
                                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
                                >
                                  Cargo
                                </th>

                                <th
                                  scope='col'
                                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
                                >
                                  Departamento
                                </th>

                                <th
                                  scope='col'
                                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
                                >
                                  E-mail
                                </th>

                                <th
                                  scope='col'
                                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'
                                >
                                  Status
                                </th>

                                <th scope='col' className='relative px-6 py-3'>
                                  <span className='sr-only'>Ações</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-slate-200'>
                              {filteredData.map((emp) => (
                                <EmployeeTableRow
                                  key={emp._id}
                                  employee={emp}
                                  onEdit={() => setEditingEmployee(emp)}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className='block md:hidden space-y-4'>
                        {filteredData.map((emp) => (
                          <EmployeeCard
                            key={emp._id}
                            employee={emp}
                            onEdit={() => setEditingEmployee(emp)}
                          />
                        ))}
                      </div>
                    </>

                    
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
