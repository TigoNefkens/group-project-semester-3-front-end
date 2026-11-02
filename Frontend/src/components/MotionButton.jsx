import React from "react";
import { motion } from "framer-motion";
import "./MotionButton.css";

export default function BouncyButton({ children, onClick, style }) {
  return (
    <motion.button className="bouncy-button" onClick={onClick} whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.92, y: 2 }} transition={{type: "spring",stiffness: 500,damping: 12}} style={{...style,}}>
      {children}
    </motion.button>
  );
}