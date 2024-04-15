import React from 'react'
import './Modal.scss'

interface ModalProps {
  isOpen: boolean
  closeModal: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, closeModal }) => {
  const handleClickCloseModal = () => {
    closeModal()
  }

  return (
    <>
      {isOpen && (
        <div className="modal" onClick={handleClickCloseModal}>
          <div className="modal__content">
            {children}
            <button className="btn btn__close-modal" onClick={handleClickCloseModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
