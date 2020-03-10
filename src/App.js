import React, { useState, useRef, useEffect, createContext } from 'react';
import './App.css';
import a from './Components/Modal';
const { Modal, ModalProvider } = a;
export const ModalContext = createContext();

function App() {
  const modalCloseBtnEl = useRef(null);
  const dialogContentEl = useRef(null);
  const modalOpenBtnEl = useRef(null);
  const otherButtonEl = useRef(null);

  const [isModalOpen, toggleModal] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const [dialogElRefs, setRefs] = useState([]);
  const [lastFocusedElement, setLastFocused] = useState(useRef(null));

  useEffect(() => {
    // handle last focused before open
    const handleFocusIn = (e) => {
      if (!isModalOpen) {
        setLastFocused(document.activeElement);
      }
    }
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [isModalOpen, lastFocusedElement]);

  useEffect(() => {
    // set modals children refs and 
    setRefs([modalCloseBtnEl, dialogContentEl]);
    setLastFocused(modalOpenBtnEl);
    // focus on open modal button
    modalOpenBtnEl.current.focus();
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.which === 9) {
        // handle tab toggle in modal
        if (event.preventDefault && isModalOpen) {
          event.preventDefault();
          if (focusIdx === dialogElRefs.length - 1) {
            setFocusIdx(0);
          }
          else {
            setFocusIdx(focusIdx + 1);
          }
        }
      }
      // handle esc press
      if (event.which === 27) {
        lastFocusedElement.focus ? lastFocusedElement.focus() : lastFocusedElement.current.focus();
        toggleModal(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, [focusIdx, isModalOpen, dialogElRefs])
  
  useEffect(() => {
    if (!isModalOpen) {
      // lastFocusedElement.current.focus();
      setFocusIdx(0)
    }
    
    if (isModalOpen) {
      dialogElRefs[focusIdx].current.focus();
    }


  }, [isModalOpen, modalCloseBtnEl, dialogElRefs, focusIdx, lastFocusedElement])



  const handleOpenClick = () => {
    setLastFocused(document.activeElement)
    toggleModal(true);
  }

  return (
    <ModalProvider>
      <div className="App">
        <section >
          <div id="sectionContent" aria-hidden={isModalOpen}>
            <button ref={otherButtonEl}>other</button>
            <button onClick={handleOpenClick} ref={modalOpenBtnEl}>open modal</button>
          </div>
          {isModalOpen && (
            <Modal
              toggleModal={toggleModal}
              isModalOpen={isModalOpen}
              lastFocusedElement={lastFocusedElement}
            >
              <button
                className="modalClose"
                type="button"
                ref={modalCloseBtnEl}
                onClick={() => {
                  lastFocusedElement.focus ? lastFocusedElement.focus() : lastFocusedElement.current.focus();
                  toggleModal(false);
                 }}
              >
                X
              </button>
              <div role="document" ref={dialogContentEl}>
                dialog content
              </div>
            </Modal>)
          }
        </section>
      </div>
    </ModalProvider>
  );
}

export default App;
