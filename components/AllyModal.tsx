import cc from "classcat";
import { motion } from "framer-motion";

interface AllyModalProps {
  setAllies: Function;
}

const AllyModal = ({ setAllies }: AllyModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={"w-full h-full max-w-[650px] md:h-[650px] bg-white md:rounded-2xl flex flex-col items-center"}
    >
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
        <div
          className={"w-full h-full max-w-[450px] md:h-[650px] bg-white md:rounded-2xl flex flex-col items-center"}
        ></div>
      </div>
    </motion.div>
  );
};

export default AllyModal;
