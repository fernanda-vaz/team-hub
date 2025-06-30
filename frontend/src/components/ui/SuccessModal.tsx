import { Modal } from 'antd'
import type { ReactNode } from 'react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onOk: () => void
  content: ReactNode
}

export const SuccessModal = ({
  isOpen,
  onClose,
  onOk,
  content,
}: SuccessModalProps) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={{ 'aria-label': 'Custom Close Button' }}
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
      }}
    >
      <div className='flex flex-col p-8 gap-4 '>
        <p className='text-xl text-slate-700 font-bold'>{content}</p>

        <div className='items-center text-center'>
          <button
            onClick={onOk}
            className='px-6 py-2 text-indigo-500 font-bold text-lg hover:text-indigo-300 cursor-pointer transition-colors duration-300'
          >
            Ok
          </button>
        </div>
      </div>
    </Modal>
  )
}
