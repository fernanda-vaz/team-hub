import { Button, Modal, type ButtonProps } from 'antd'
import type { ReactNode } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onOk: () => void
  title: string
  content: ReactNode
  okText?: string
  cancelText?: string
  okButtonProps?: ButtonProps
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onOk,
  content,
  okText = 'OK',
  cancelText = 'Cancelar',
  okButtonProps = {},
}: ConfirmationModalProps) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key='back' onClick={onClose}>
          {cancelText}
        </Button>,
        <Button key='submit' type='primary' onClick={onOk} {...okButtonProps}>
          {okText}
        </Button>,
      ]}
      centered
      styles={{
        content: {
          background: 'rgba(255, 255, 255, 0.80)',
          backdropFilter: 'blur(5px)',
          borderRadius: '24px',
          padding: '32px',
          minWidth: '564px',
          boxShadow: 'box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.35)',
        },
        header: {
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px',
          marginBottom: '16px',
        },
        footer: {
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px',
          marginTop: '16px',
        },
      }}
    >
      <div className='text-base text-slate-600'>{content}</div>
    </Modal>
  )
}
