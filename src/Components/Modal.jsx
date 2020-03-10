import './Modal.css'
import React, { useEffect, useRef, useState, useContext } from 'react'
import { createPortal } from 'react-dom'

const Context = React.createContext();

const ModalProvider = ({ children }) => {
  const modalRef = useRef();
  const [context, setContext] = useState();
  
  useEffect(() => {
    setContext(modalRef.current);
  }, []);

  return (
    <div>
      <Context.Provider value={context}>{children}</Context.Provider>
      <div ref={modalRef} />
    </div>
  );
}

const Modal = ({ children, toggleModal, isModalOpen, lastFocusedElement }) => {
  const modalNode = useContext(Context);

  const content = modalNode ? createPortal(<div id="dialogPlaceholder" >
    <div className="overlay" onClick={() => {
      lastFocusedElement.focus ? lastFocusedElement.focus() : lastFocusedElement.current.focus();
      toggleModal(false);
    }}>visual overlay</div>
    <dialog open={isModalOpen}>
      {children}
    </dialog>
  </div >, modalNode) : null
  return content
}

export default { Modal, ModalProvider }