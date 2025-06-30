import { useDispatch } from 'react-redux'
import type { Employee } from '../models/employee.model'
import type { AppDispatch } from '../app/store'
import { Button, Dropdown, message, type MenuProps } from 'antd'
import { useState } from 'react'
import { deleteEmployee } from '../features/employees/employeesSlice'
import { ConfirmationModal } from './ui/ConfirmationModal'
import { ThreeDotsIcon } from './ui/icons'
import { EditEmployeeForm } from './EditEmployeeForm'

interface EmployeeTableRowProps {
  employee: Employee
  onEdit: () => void
}

export const EmployeeTableRow = ({
  employee,
  onEdit,
}: EmployeeTableRowProps) => {
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

  const showDeleteModal = () => {
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
      label: 'Excluir',
      onClick: (e) => {
        e.domEvent.stopPropagation()
        showDeleteModal()
      },

      className: 'custom-menu-item ant-dropdown-menu-item',
    },
  ]

  if (editing) {
    return (
      <EditEmployeeForm
        employee={employee}
        onCancel={() => setEditing(false)}
        onSuccess={() => {
          setEditing(false)
          messageApi.success('Funcionário atualizado com sucesso!')
        }}
      />
    )
  }

  return (
    <>
      {contextHolder}

      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        content={`Tem certeza que deseja excluir o funcionário ${employee.nome}? Esta ação não pode ser desfeita.`}
        onOk={handleDelete}
        title='Confirmar Exclusão'
      />

      <tr
        className={`px-2 text-xs  font-semibold ${
          employee.ativo
            ? 'bg-white text-slate-700'
            : 'bg-gray-100 text-slate-300'
        }`}
      >
        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='text-sm font-medium '>{employee.nome}</div>
        </td>

        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='text-sm '>{employee.cargo}</div>
        </td>

        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='text-sm '>{employee.departamento}</div>
        </td>

        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='text-sm '>{employee.email}</div>
        </td>

        <td className='px-6 py-4 whitespace-nowrap'>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              employee.ativo
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {employee.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement='bottomRight'
            overlayClassName='custom-dropdown-menu'
            open={dropdownVisible}
            onOpenChange={setDropdownVisible}
          >
            <Button
              type='text'
              shape='circle'
              icon={<ThreeDotsIcon />}
              className='hover:text-indigo-600'
            />
          </Dropdown>
        </td>
      </tr>
    </>
  )
}
