import type { Employee } from '../models/employee.model'
import { Button, Dropdown, type MenuProps } from 'antd'
import { ThreeDotsIcon } from './ui/icons'
import clsx from 'clsx'

interface DepartmentCardProps {
  departmentName: string
  employees: Employee[]
  onEditEmployee: (employee: Employee) => void
}

export const DepartmentCard = ({
  departmentName,
  employees,
  onEditEmployee,
}: DepartmentCardProps) => {
  const getMenuItems = (employee: Employee): MenuProps['items'] => [
    {
      key: '1',
      label: 'Alterar Cargo/Depto',
      onClick: () => onEditEmployee(employee),
    },
  ]

  return (
    <div className='bg-white shadow-md rounded-lg overflow-hidden'>
      <div className='p-4 bg-gray-200 border-b border-gray-200 flex justify-between items-center'>
        <h3 className='text-lg sm:text-xl font-bold text-gray-800'>
          {departmentName}
        </h3>
        <span className='px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full'>
          {employees.length} funcionário(s)
        </span>
      </div>

      <div className='hidden sm:block overflow-x-auto'>
        <table className='min-w-full'>
          <thead className='bg-white'>
            <tr>
              <th className='bg-gray-100 py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Nome
              </th>
              <th className='bg-gray-100  py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Cargo
              </th>
              <th className='bg-gray-100  py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='bg-gray-100  relative py-2 px-4'>
                <span className='sr-only'>Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {employees.map((employee) => (
              <tr
                className={clsx(
                  'px-2 text-sm  font-semibold hover:bg-gray-50',
                  employee.ativo
                    ? 'bg-white text-slate-700'
                    : 'bg-gray-100 text-slate-300'
                )}
              >
                <td className='px-4 py-3 whitespace-nowrap font-medium text-gray-900'>
                  {employee.nome}
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-gray-600'>
                  {employee.cargo}
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-gray-600'>
                  <span
                    className={clsx(
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      employee.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {employee.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>

                <td className='px-4 py-3 whitespace-nowrap text-right'>
                  <Dropdown
                    menu={{ items: getMenuItems(employee) }}
                    trigger={['click']}
                    placement='bottomRight'
                  >
                    <Button
                      type='text'
                      shape='circle'
                      icon={<ThreeDotsIcon />}
                      className='text-gray-500 hover:text-indigo-600'
                    />
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='block sm:hidden p-4 space-y-3'>
        {employees.map((employee) => (
          <div
            key={employee._id}
            className={clsx(
              'p-3 rounded-md border',
              employee.ativo
                ? 'border-gray-200 bg-white'
                : 'border-gray-100 bg-gray-50'
            )}
          >
            <div className='flex justify-between items-start mb-2'>
              <div>
                <p
                  className={clsx(
                    'font-bold',
                    employee.ativo ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {employee.nome}
                </p>
                <p
                  className={clsx(
                    'text-sm',
                    employee.ativo ? 'text-gray-600' : 'text-gray-400'
                  )}
                >
                  {employee.cargo}
                </p>
              </div>
              <Dropdown
                menu={{ items: getMenuItems(employee) }}
                trigger={['click']}
                placement='bottomRight'
              >
                <Button
                  type='text'
                  shape='circle'
                  icon={<ThreeDotsIcon />}
                  className='text-gray-500'
                />
              </Dropdown>
            </div>
            <div className='flex justify-end pt-2 border-t border-gray-100'>
              <span
                className={clsx(
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  employee.ativo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                )}
              >
                {employee.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
