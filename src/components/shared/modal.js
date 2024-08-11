import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
  } from "react";
  import FocusTrap from "focus-trap-react";
  import { motion } from "framer-motion";
  import Leaflet from "./leaflet";
  import useWindowSize from "../../hooks/use-window-size";
  
  export default function Modal(
    children,
    showModal,
    setShowModal,
  ) {
    const desktopModalRef = useRef(null);
  
    const onKeyDown = useCallback(
      (e) => {
        if (e.key === "Escape") {
          setShowModal(false);
        }
      },
      [setShowModal],
    );
  
    useEffect(() => {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);
  
    const { isMobile, isDesktop } = useWindowSize();
  
    return (
      <>
        {showModal && (
          <>
            {isMobile && <Leaflet setShow={setShowModal}>{children}</Leaflet>}
            {isDesktop && (
              <>
                <FocusTrap focusTrapOptions={{ initialFocus: false }}>
                  <motion.div
                    ref={desktopModalRef}
                    key="desktop-modal"
                    className="fixed inset-0 z-[1000] hidden min-h-screen items-center justify-center md:flex"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    onMouseDown={(e) => {
                      if (desktopModalRef.current === e.target) {
                        setShowModal(false);
                      }
                    }}
                  >
                    {children}
                  </motion.div>
                </FocusTrap>
                <motion.div
                  key="desktop-backdrop"
                  className="fixed inset-0 z-[900] bg-gray-100 bg-opacity-10 backdrop-blur"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowModal(false)}
                />
              </>
            )}
          </>
        )}
      </>
    );
  }