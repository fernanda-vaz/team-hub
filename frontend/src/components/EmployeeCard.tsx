import { useDispatch } from 'react-redux'
import type { Employee } from '../models/employee.model'
import type { AppDispatch } from '../app/store'
import { Button, Dropdown, message, type MenuProps } from 'antd'
import { useState } from 'react'
import { deleteEmployee } from '../features/employees/employeesSlice'
import clsx from 'clsx'
import { ThreeDotsIcon } from './ui/icons'
import { SuccessModal } from './ui/SuccessModal'

interface EmployeeCardProps {
  employee: Employee
  onEdit: () => void
}

export const EmployeeCard = ({ employee, onEdit }: EmployeeCardProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [messageApi, contextHolder] = message.useMessage()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleDelete = async () => {
    setDropdownVisible(false)
    setIsSuccessModalOpen(false)

    try {
      const resultAction = await dispatch(deleteEmployee(employee._id))

      if (deleteEmployee.fulfilled.match(resultAction)) {
        messageApi.success('Funcionário excluído com sucesso!')
      } else {
        messageApi.error('Falha ao excluir funcionário.')
        console.error('Erro na exclusão:', resultAction.error)
      }
    } catch (error) {
      messageApi.error('Erro ao excluir funcionário.')
      console.error('Erro detalhado:', error)
    }
  }

  const showModal = () => {
    setDropdownVisible(false)
    setIsSuccessModalOpen(true)
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Alterar',
      className: 'custom-menu-item ant-dropdown-menu-item',
      onClick: (e) => {
        e.domEvent.stopPropagation()
        onEdit()
      },
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: (
        <span
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            showModal()
          }}
        >
          Excluir
        </span>
      ),
      className: 'custom-menu-item ant-dropdown-menu-item',
    },
  ]

  if (editing) {
    return <p>Carregando</p>
  }

  return (
    <>
      {contextHolder}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        content='Usuário excluído com sucesso!'
        onOk={handleDelete}
      />

      <div
        className={clsx(
          'flex items-center justify-between rounded-lg shadow-sm transition-all text-slate-700 relative',
          employee.ativo ? 'bg-indigo-200' : 'bg-gray-200'
        )}
      >
        <div className='p-4'>
          <h3 className='text-2xl pb-2'>{employee.nome}</h3>

          <div className='flex gap-4'>
            <div className='px-4 py-1 bg-indigo-500 rounded-4xl text-white'>
              <p>{employee.cpf}</p>
            </div>

            <div className='px-4 py-1 bg-indigo-500 rounded-4xl text-white'>
              <span>{employee.ativo ? 'Ativo' : 'Inativo'}</span>
            </div>

            <div className='px-4 py-1 bg-indigo-500 rounded-4xl text-white'>
              <p>{employee.cargo}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col bg-indigo-500 px-1 py-9 h-full justify-center rounded-tr-lg rounded-br-lg'>
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement='top'
            overlayClassName='custom-dropdown-menu'
            open={dropdownVisible}
            onOpenChange={(visible) => setDropdownVisible(visible)}
          >
            <Button
              type='text'
              icon={<ThreeDotsIcon />}
              className='absolute right-0 top-0 h-full px-3 flex items-center justify-center hover:bg-indigo-300 rounded-r-lg'
            />
          </Dropdown>
        </div>
      </div>
    </>
  )
}
