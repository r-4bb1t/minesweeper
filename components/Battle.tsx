import { useEffect, useState } from "react";
import cc from "classcat";
import Text from "./Text";
import script from "../scripts/script.json";
import enemy_attack from "../scripts/enemy_attack.json";
import allies_info from "../scripts/allies_info.json";
import { motion } from "framer-motion";

interface BattleProps {
  hps: number[];
  setHps: (a: number | any) => void;
  endBattle: () => void;
  allies: number[];
  gameOver: () => void;
  options: number[][];
}

const Battle = ({ hps, setHps, endBattle, allies, gameOver, options }: BattleProps) => {
  const [isEffect, setIsEffect] = useState(false);
  const [index, setIndex] = useState(0);
  const [teamIndex, setTeamIndex] = useState(-1);
  const [enemyHp, setEnemyHp] = useState(50);
  const [isEnemyAttacked, setIsEnemyAttacked] = useState(false);
  const [isAttacked, setIsAttacked] = useState(Array.from({ length: hps.length }, () => false));
  const [myTurn, setMyTurn] = useState(false);
  const [prevHps, setPrevHps] = useState(Array.from(hps));

  const [flag, setFlag] = useState(true);

  useEffect(() => {
    if (index % 2 === 1) setTeamIndex(0);
    else setTeamIndex(-1);
    setMyTurn(index % 2 === 1);
    if (hps.every((h) => h <= 0)) {
      endBattle();
      gameOver();
    }
  }, [index]);

  useEffect(() => {
    if (!flag && enemyHp <= 0) endBattle();
  }, [flag]);

  useEffect(() => {
    setIsEnemyAttacked(true);
    setTimeout(() => {
      setIsEnemyAttacked(false);
    }, 1000);
  }, [enemyHp]);

  useEffect(() => {
    if (isAttacked.every((_) => false)) return;
    setTimeout(() => {
      setIsAttacked((s) => s.map((_) => false));
    }, 1000);
  }, [isAttacked]);

  useEffect(() => {
    if (!("attack" in script[index]) || enemyHp <= 0) return;
    const attacks = enemy_attack[script[index].attack!].attack;
    const newAttacked = Array.from(isAttacked);
    const randomAttack = attacks[Math.floor(Math.random() * attacks.length)];
    const newHps = hps.map((hp, i) => {
      if (randomAttack[i] > 0) newAttacked[i] = true;
      return hp - randomAttack[i];
    });
    setPrevHps(hps);
    setHps(newHps);
    setTimeout(() => {
      setIsAttacked(newAttacked);
    }, 1000);
  }, [index]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
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
          {allies.map((a, i) => (
            <div
              className={cc([
                "aspect-square w-full relative",
                myTurn && teamIndex === i && "bg-slate-300",
                hps[i] <= 0 && "opacity-20",
              ])}
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
                <img
                  src={allies_info[a].src}
                  className={cc(["object-contain z-[3000]", isAttacked[i] && "animate-pulse"])}
                />
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
          options={options[teamIndex]}
          teamIndex={teamIndex}
          nextTeam={() => setTeamIndex((i) => (i + 1) % allies.length)}
          setEnemyHp={setEnemyHp}
          isEnd={enemyHp <= 0}
          allies={allies}
          gaps={prevHps.map((p, i) => hps[i] - p)}
          hps={hps}
          flag={flag}
          setFlag={setFlag}
        />
      </motion.div>
    </div>
  );
};

export default Battle;
