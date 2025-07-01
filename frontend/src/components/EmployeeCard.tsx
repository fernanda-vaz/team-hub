import { useDispatch } from 'react-redux'
import type { Employee } from '../models/employee.model'
import type { AppDispatch } from '../app/store'
import { Button, Dropdown, message, type MenuProps } from 'antd'
import { useState } from 'react'
import { deleteEmployee } from '../features/employees/employeesSlice'
import { ConfirmationModal } from './ui/ConfirmationModal'
import { ThreeDotsIcon } from './ui/icons'
import clsx from 'clsx'

interface EmployeeCardProps {
  employee: Employee
  onEdit: () => void
}

export const EmployeeCard = ({ employee, onEdit }: EmployeeCardProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [messageApi, contextHolder] = message.useMessage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = async () => {
    try {
      // O .unwrap() fará com que a promise seja rejeitada em caso de erro, caindo no bloco catch
      await dispatch(deleteEmployee(employee._id)).unwrap()
      messageApi.success('Funcionário excluído com sucesso!')
    } catch (error) {
      // Antd message.error pode receber o objeto de erro diretamente para exibir a mensagem
      const errorMessage =
        (error as any)?.message || 'Falha ao excluir funcionário.'
      messageApi.error(errorMessage)
      console.error('Erro na exclusão:', error)
    }
  }

  const items: MenuProps['items'] = [
    { key: '1', label: 'Alterar', onClick: onEdit },
    { type: 'divider' },
    {
      key: '2',
      label: 'Excluir',
      onClick: () => setIsModalOpen(true),
      danger: true,
    },
  ]

  return (
    <>
      {contextHolder}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOk={handleDelete}
        title='Confirmar Exclusão'
        content={`Tem certeza que deseja excluir o funcionário ${employee.nome}? Esta ação não pode ser desfeita.`}
        okButtonProps={{ danger: true }}
        okText='Excluir'
      />
      <div
        className={clsx(
          'p-4 rounded-lg shadow-md border border-gray-200',
          employee.ativo
            ? 'bg-white text-slate-700'
            : 'bg-gray-100 text-slate-300'
        )}
      >
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='text-lg font-bold text-gray-900'>{employee.nome}</h3>
            <p className='text-sm text-gray-500'>{employee.cargo}</p>
          </div>

          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement='bottomRight'
          >
            <Button type='text' shape='circle' icon={<ThreeDotsIcon />} />
          </Dropdown>
        </div>

        <div className='mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-500 font-medium'>Departamento:</span>
            <span className='text-gray-800 font-semibold'>
              {employee.departamento}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-500 font-medium'>E-mail:</span>
            <span className='text-gray-800 truncate'>{employee.email}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-500 font-medium'>Status:</span>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                employee.ativo
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {employee.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
