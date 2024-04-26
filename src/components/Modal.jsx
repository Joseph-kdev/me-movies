import React, { useEffect, useRef } from 'react'
import './stylesheets/modal.css'


export const Modal = ({ openModal, closeModal, children}) => {
    const ref = useRef();

    useEffect(() => {
      if (openModal) {
        ref.current?.showModal();
        ref.current?.addEventListener('click', handleOverlayClick);
      } else {
        ref.current?.close();
        ref.current?.removeEventListener('click', handleOverlayClick);
      }
    }, [openModal]);
  
    // Event handler function to close the modal when the overlay is clicked
    const handleOverlayClick = (event) => {
      if (event.target === ref.current) {
        closeModal();
      }
    };
  
  return (
    <dialog
      ref={ref}
      onCancel={closeModal}
      className='modal'
  >
    {children}
    <button onClick={closeModal} className='modal-button'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-6 h-6" width="24px" height="24px">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
    </button>
  </dialog>
  )
}
