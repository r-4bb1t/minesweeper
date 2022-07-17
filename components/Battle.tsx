import { useEffect, useState } from "react";
import cc from "classcat";
import Text from "./Text";
import script from "./script.json";
import enemy_attack from "./enemy_attack.json";

interface BattleProps {
  hps: number[];
  setHps: (a: number | any) => void;
  endBattle: () => void;
}

const Battle = ({ hps, setHps, endBattle }: BattleProps) => {
  const [isEffect, setIsEffect] = useState(false);
  const [index, setIndex] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(50);
  const [isEnemyAttacked, setIsEnemyAttacked] = useState(false);

  useEffect(() => {
    setIsEnemyAttacked(true);
    setTimeout(() => {
      setIsEnemyAttacked(false);
    }, 1000);
  }, [enemyHp]);

  useEffect(() => {
    if ("attack" in script[index]) {
      const attacks = enemy_attack[script[index].attack!].attack;
      const randomAttack = attacks[Math.floor(Math.random() * attacks.length)];
      const newHps = hps.map((hp, i) => hp - randomAttack[i]);
      setHps(newHps);
    }
  }, [index]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
      <div
        className={cc([
          "w-full h-full max-w-[650px] md:h-[650px] bg-white md:rounded-2xl flex flex-col items-center",
          isEffect && "animate-shake",
        ])}
      >
        <div className="w-1/2 h-6 bg-slate-700 relative mt-10 rounded-full">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${(enemyHp / 50) * 100}%` }}></div>
        </div>
        <img
          src="/assets/sheep.png"
          className={cc(["w-full md:h-60 h-1/3 object-contain p-10 flex-shrink-0", isEnemyAttacked && "animate-shake"])}
        />
        <div className="w-full grid grid-cols-4 bg-slate-200">
          {[1, 2, 3, 4].map((a, i) => (
            <div
              className={cc(["aspect-square w-full relative", index % 2 === 1 && teamIndex === i && "bg-slate-300"])}
              key={a}
            >
              <div
                className={cc([
                  "absolute inset-2 top-auto bg-red-500 bg-opacity-40",
                  hps[i] > 10 && "bg-yellow-400",
                  hps[i] > 30 && "bg-green-400",
                ])}
                style={{ height: `calc(${(hps[i] / 50) * 100}% - 1rem)` }}
              ></div>
              <div className="absolute inset-2">
                <img src={`/assets/team${a}.gif`} className="object-contain z-[3000]" />
              </div>
            </div>
          ))}
        </div>
        <Text
          shake={() => {
            setIsEffect(true);
            setTimeout(() => setIsEffect(false), 1000);
          }}
          index={index}
          setIndex={setIndex}
          options={[0, 1, 2, 3]}
          teamIndex={teamIndex}
          nextTeam={() => setTeamIndex((i) => (i + 1) % 4)}
          setEnemyHp={setEnemyHp}
        />
      </div>
    </div>
  );
};

export default Battle;
