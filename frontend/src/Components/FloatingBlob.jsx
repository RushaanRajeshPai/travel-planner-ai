import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const FloatingBlob = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-0 pointer-events-none mix-blend-soft-light"
      style={{
        translateX: springX,
        translateY: springY,
      }}
    >
      <div className="w-[200px] h-[200px] 
  bg-gradient-to-br from-purple-500 via-blue-400 to-cyan-300 
  blur-2xl opacity-60 rounded-full mix-blend-soft-light" />
    </motion.div>
  );
};

export default FloatingBlob;
