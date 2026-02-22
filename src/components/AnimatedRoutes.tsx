import { ReactNode } from "react";
import { useLocation, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

interface AnimatedRoutesProps {
  children: ReactNode;
}

const AnimatedRoutes = ({ children }: AnimatedRoutesProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;