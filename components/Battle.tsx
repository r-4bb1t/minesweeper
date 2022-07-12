import { useState } from "react";
import Text from "./Text";

interface BattleProps {
  endBattle: () => void;
}

const Battle = ({ endBattle }: BattleProps) => {
  const [isEffect, setIsEffect] = useState(false);
  const [index, setIndex] = useState(0);
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
      <div
        className={`w-full h-full max-w-[700px] max-h-[500px] bg-white md:rounded-2xl flex flex-col ${
          isEffect && "animate-shake"
        }`}
      >
        <img src="/assets/sheep.png" className="w-full h-[250px] flex-1 object-contain p-10" />
        <Text
          shake={() => {
            setIsEffect(true);
            setTimeout(() => setIsEffect(false), 1000);
          }}
          index={index}
          setIndex={setIndex}
        />
      </div>
    </div>
  );
};

export default Battle;
