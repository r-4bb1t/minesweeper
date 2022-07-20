import cc from "classcat";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import allies_info from "../scripts/allies_info.json";

interface AllyModalProps {
  setAllies: Function;
  newAlly: number;
  close: () => void;
}

const AllyModal = ({ setAllies, newAlly, close }: AllyModalProps) => {
  useEffect(() => {
    setAllies(newAlly);
    setTimeout(close, 5000);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className="w-full h-full max-w-[400px] md:h-[450px] bg-white md:rounded-2xl flex flex-col items-center"
      >
        {newAlly !== -1 && (
          <>
            <img src={allies_info[newAlly].src} className={"object-contain z-[3000]"} />
            <div>{allies_info[newAlly].name}이(가) 새 동료가 되었다!</div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AllyModal;
