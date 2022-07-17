import { useState } from "react";
import cc from "classcat";
import Text from "./Text";

interface BattleProps {
  endBattle: () => void;
}

const Battle = ({ endBattle }: BattleProps) => {
  const [isEffect, setIsEffect] = useState(false);
  const [index, setIndex] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
      <div
        className={`w-full h-full max-w-[700px] max-h-[550px] bg-white md:rounded-2xl flex flex-col ${
          isEffect && "animate-shake"
        }`}
      >
        <img src="/assets/sheep.png" className="w-full h-60 object-contain p-10" />
        <div className="grid grid-cols-4 p-5 gap-10 bg-slate-100">
          {[1, 2, 3, 4].map((a, i) => (
            <div
              className={cc(["aspect-square p-4 w-full", index % 2 === 1 && teamIndex === i && "bg-slate-300"])}
              key={a}
            >
              <img src={`/assets/team${a}.gif`} className="object-contain" />
            </div>
          ))}
        </div>
        <div className="h-full">
          <Text
            shake={() => {
              setIsEffect(true);
              setTimeout(() => setIsEffect(false), 1000);
            }}
            index={index}
            setIndex={setIndex}
            options={[0, 1]}
            teamIndex={teamIndex}
            nextTeam={() => setTeamIndex((i) => i + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default Battle;
