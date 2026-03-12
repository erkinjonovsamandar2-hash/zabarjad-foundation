import { ReactNode } from "react";
import { useLocation, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

interface AnimatedRoutesProps {
  children: ReactNode;
}

// FIX: AnimatedRoutes is now a pure passthrough.
//
// The previous structure was:
//   <AnimatePresence mode="wait">
//     <Routes key={pathname}>          ← lazy routes suspend inside here
//       <Route element={<Suspense>}/>   ← Suspense fallback + Route = 2 children
//     </Routes>
//   </AnimatePresence>
//
// When a lazy page suspended, React rendered the Suspense fallback AND kept
// the old <Routes> tree alive simultaneously. AnimatePresence mode="wait"
// saw multiple competing children, stalled the exit pipeline, and froze the
// entire app on the loading splash forever.
//
// THE FIX: AnimatePresence is removed from here entirely.
// It now lives in App.tsx, wrapping <Routes> DIRECTLY as its only child —
// no Suspense wrapper between AnimatePresence and Routes.
// Each lazy route element carries its own <Suspense> boundary, scoped tightly
// to that single component — not to the entire routing tree.
const AnimatedRoutes = ({ children }: AnimatedRoutesProps) => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {children}
    </Routes>
  );
};

export default AnimatedRoutes;