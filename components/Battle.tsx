import { useEffect, useState } from "react";
import cc from "classcat";
import Text from "./Text";
import script from "../scripts/script.json";
import enemy_attack from "../scripts/enemy_attack.json";
import allies_info from "../scripts/allies_info.json";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";

interface BattleProps {
  enemyType: number;
  hps: number[];
  setHps: (a: number | any) => void;
  endBattle: () => void;
  allies: number[];
  gameOver: () => void;
  options: number[][];
  items: { id: number; cnt: number }[];
  setItems: (a: { id: number; cnt: number }[] | any) => void;
}

const Battle = ({ enemyType, hps, setHps, endBattle, allies, gameOver, options, items, setItems }: BattleProps) => {
  const [isEffect, setIsEffect] = useState(false);
  const [index, setIndex] = useState(enemyType === 0 ? 0 : 4);
  const [teamIndex, setTeamIndex] = useState(-1);
  const [enemyHp, setEnemyHp] = useState(enemyType === 0 ? 50 : 200);
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
      const audio = new Audio("/assets/sound/gameover.wav");
      audio.play();
      endBattle();
      gameOver();
    }
  }, [index]);

  useEffect(() => {
    if (!flag && enemyHp <= 0) {
      const audio = new Audio("/assets/sound/win.wav");
      audio.play();
      endBattle();
    }
  }, [flag]);

  useEffect(() => {
    setIsEnemyAttacked(true);
    setTimeout(() => {
      setIsEnemyAttacked(false);
    }, 500);
  }, [enemyHp]);

  useEffect(() => {
    if (isAttacked.every((_) => false)) return;
    setTimeout(() => {
      setIsAttacked((s) => s.map((_) => false));
    }, 500);
  }, [isAttacked]);

  useEffect(() => {
    if (!("attack" in script[index]) || enemyHp <= 0) return;
    const attacks = enemy_attack[script[index].attack!].attack;
    const newAttacked = Array.from(isAttacked);
    const randomAttack = attacks[Math.floor(Math.random() * attacks.length)];
    const newHps = hps.map((hp, i) => {
      if (randomAttack[i] > 0 && hp > 0) {
        newAttacked[i] = true;
        setTimeout(() => {
          toast(
            hp - randomAttack[i] <= 0
              ? allies_info[allies[i]].messages.defeated
              : allies_info[allies[i]].messages.attacked,
            { containerId: i },
          );
        }, 100);

        /* newMessages[i] =
          hp - randomAttack[i] <= 0
            ? allies_info[allies[i]].messages.defeated
            : allies_info[allies[i]].messages.attacked; */
      }
      return Math.max(hp - randomAttack[i], 0);
    });
    setPrevHps(hps);
    setHps(newHps);
    setIsAttacked(newAttacked);
  }, [index]);

  return (
    <>
      <audio autoPlay preload="auto" loop>
        <source src="/assets/sound/battle.wav" type="audio/wav" />
      </audio>
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
          <div className="w-80 h-4 bg-black relative mt-10 rounded-full flex-shrink-0">
            <div
              className="h-full bg-enemy-hp rounded-full"
              style={{ width: `${(enemyHp / (enemyType === 0 ? 50 : 200)) * 100}%` }}
            ></div>
            <div className="absolute inset-0">
              <img src="/assets/enemyhpframe.png" />
            </div>
          </div>
          <img
            src={enemyType === 0 ? "/assets/sheep.png" : "/assets/boss.png"}
            className={cc([
              "w-full md:h-48 h-1/3 object-contain p-10 flex-shrink-0",
              isEnemyAttacked && "animate-shake",
            ])}
          />
          <div className="w-full grid grid-cols-4 bg-slate-200">
            {allies.map((a, i) => (
              <div
                className={cc(["aspect-square w-full relative", myTurn && teamIndex === i && "bg-slate-300"])}
                key={a}
              >
                <div
                  className={cc([
                    "absolute inset-2 top-auto bg-hp-danger bg-opacity-40",
                    hps[i] > 10 && "bg-hp-warn",
                    hps[i] > 30 && "bg-hp-good",
                  ])}
                  style={{ height: `calc(${(hps[i] / 50) * 100}% - 1rem)` }}
                ></div>
                <div className="absolute p-2 inset-2">
                  <ToastContainer
                    closeButton={false}
                    closeOnClick={false}
                    enableMultiContainer
                    containerId={i}
                    autoClose={200}
                    newestOnTop={true}
                    position="bottom-center"
                    transition={cssTransition({
                      collapseDuration: 100,
                      enter: "animate__animated animate__bounceIn",
                      exit: "animate__animated animate__bounceOut",
                    })}
                  />
                  <img
                    src={allies_info[a].src}
                    className={cc([
                      "object-contain z-[3000] w-full h-full",
                      isAttacked[i] && "animate-pulse-2",
                      hps[i] <= 0 && "opacity-20",
                    ])}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full grid grid-cols-5 bg-slate-200">
            {items.map((item, i) => (
              <div key={i}></div>
            ))}
          </div>
          <Text
            shake={() => {
              setIsEffect(true);
              setTimeout(() => setIsEffect(false), 500);
            }}
            index={index}
            setIndex={setIndex}
            options={options[teamIndex]}
            items={items}
            setItems={setItems}
            teamIndex={teamIndex}
            nextTeam={() => setTeamIndex((i) => (i + 1) % allies.length)}
            setEnemyHp={setEnemyHp}
            setHps={setHps}
            isEnd={enemyHp <= 0}
            allies={allies}
            gaps={prevHps.map((p, i) => hps[i] - p)}
            hps={hps}
            flag={flag}
            setFlag={setFlag}
          />
        </motion.div>
      </div>
    </>
  );
};

export default Battle;
