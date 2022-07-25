import AllyModal from "components/AllyModal";
import Battle from "components/Battle";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import allies_info from "../scripts/allies_info.json";
import { AnimatePresence, motion } from "framer-motion";
import cc from "classcat";

const dir = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],

  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
];

interface msType {
  count: number;
  hasItem: boolean;
}

enum CELL {
  none,
  monster,
  item,
  ally,
}

const Home: NextPage = () => {
  const sz = 15;
  const [mp, setMp] = useState(Array.from({ length: sz }, () => Array.from({ length: sz }, () => CELL.none)));
  const [ms, setMs] = useState(
    Array.from({ length: sz }, () =>
      Array.from({ length: sz }, () => {
        return { count: 0, hasItem: false } as msType;
      }),
    ),
  );
  const [mo, setMo] = useState(Array.from({ length: sz }, () => Array.from({ length: sz }, () => false)));
  const [mm, setMm] = useState(Array.from({ length: sz }, () => Array.from({ length: sz }, () => CELL.none)));

  const [hps, setHps] = useState([50]);
  const [options, setOptions] = useState([[0, 1]]);

  const [isEffect, setIsEffect] = useState(false);

  const [isBattle, setIsBattle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [allies, setAllies] = useState([0]);
  const [isAllyOpen, setIsAllyOpen] = useState(-1);

  const setMap = () => {
    const initMp = Array.from(mp);
    for (let i = 0; i < sz * 2; i++) {
      let x = Math.floor(Math.random() * sz);
      let y = Math.floor(Math.random() * sz);
      while (
        initMp[x][y] !== CELL.none ||
        (x >= Math.floor(sz / 2) - 1 &&
          y >= Math.floor(sz / 2) - 1 &&
          x <= Math.floor(sz / 2) + 1 &&
          y <= Math.floor(sz / 2) + 1)
      ) {
        x = Math.floor(Math.random() * sz);
        y = Math.floor(Math.random() * sz);
      }
      initMp[x][y] = CELL.monster;
    }
    for (let i = 0; i < sz / 2; i++) {
      let x = Math.floor(Math.random() * sz);
      let y = Math.floor(Math.random() * sz);
      while (
        initMp[x][y] !== CELL.none ||
        (x >= Math.floor(sz / 2) - 1 &&
          y >= Math.floor(sz / 2) - 1 &&
          x <= Math.floor(sz / 2) + 1 &&
          y <= Math.floor(sz / 2) + 1)
      ) {
        x = Math.floor(Math.random() * sz);
        y = Math.floor(Math.random() * sz);
      }
      initMp[x][y] = CELL.item;
    }
    for (let i = 0; i < sz / 2; i++) {
      let x = Math.floor(Math.random() * sz);
      let y = Math.floor(Math.random() * sz);
      while (
        initMp[x][y] !== CELL.none ||
        (x >= Math.floor(sz / 2) - 1 &&
          y >= Math.floor(sz / 2) - 1 &&
          x <= Math.floor(sz / 2) + 1 &&
          y <= Math.floor(sz / 2) + 1)
      ) {
        x = Math.floor(Math.random() * sz);
        y = Math.floor(Math.random() * sz);
      }
      initMp[x][y] = CELL.ally;
    }
    setMp(initMp);
  };

  const setMineswiper = () => {
    const initMs = Array.from(ms);
    for (let i = 0; i < sz; i++) {
      for (let j = 0; j < sz; j++) {
        let f = 0,
          h = false;
        for (let k = 0; k < 8; k++) {
          if (i + dir[k][0] < 0 || i + dir[k][0] >= sz || j + dir[k][1] < 0 || j + dir[k][1] >= sz) continue;
          if (mp[i + dir[k][0]][j + dir[k][1]] !== CELL.none) {
            f++;
            if (mp[i + dir[k][0]][j + dir[k][1]] === CELL.item || mp[i + dir[k][0]][j + dir[k][1]] === CELL.ally)
              h = true;
          }
        }
        initMs[i][j] = { count: f, hasItem: h };
      }
    }
    setMs(initMs);
  };

  const setMapOpen = () => {
    const a = [[Math.floor(sz / 2), Math.floor(sz / 2)]];
    const initMo = Array.from(mo);
    initMo[a[0][0]][a[0][1]] = true;
    while (a.length > 0) {
      let x = a[0][0],
        y = a[0][1];
      a.splice(0, 1);
      for (let k = 0; k < 4; k++) {
        if (x + dir[k][0] < 0 || x + dir[k][0] >= sz || y + dir[k][1] < 0 || y + dir[k][1] >= sz) continue;
        if (initMo[x + dir[k][0]][y + dir[k][1]]) continue;

        initMo[x + dir[k][0]][y + dir[k][1]] = true;
        if (ms[x + dir[k][0]][y + dir[k][1]].count === 0) a.push([x + dir[k][0], y + dir[k][1]]);
      }
    }
    setMo(initMo);
  };

  const open = (xx: number, yy: number) => {
    const a = [[xx, yy]];
    const initMo = Array.from(mo);
    if (!isPlaying || mo[a[0][0]][a[0][1]]) return;
    initMo[a[0][0]][a[0][1]] = true;
    if (mp[a[0][0]][a[0][1]] === CELL.monster) {
      setIsEffect(true);
      setIsPlaying(false);
      setTimeout(() => {
        setIsBattle(true);
        setIsEffect(false);
      }, 1000);
    }

    if (mp[a[0][0]][a[0][1]] === CELL.ally) {
      //setIsEffect(true);
      setIsPlaying(false);
      setTimeout(() => {
        setIsAllyOpen(Math.floor(Math.random() * (allies_info.length - 1)));
        //setIsEffect(false);
      }, 1000);
    }

    if (mp[a[0][0]][a[0][1]] === 0 && ms[a[0][0]][a[0][1]].count === 0)
      while (a.length > 0) {
        let x = a[0][0],
          y = a[0][1];
        a.splice(0, 1);
        for (let k = 0; k < 4; k++) {
          if (x + dir[k][0] < 0 || x + dir[k][0] >= sz || y + dir[k][1] < 0 || y + dir[k][1] >= sz) continue;
          if (initMo[x + dir[k][0]][y + dir[k][1]]) continue;

          initMo[x + dir[k][0]][y + dir[k][1]] = true;
          if (ms[x + dir[k][0]][y + dir[k][1]].count === 0) a.push([x + dir[k][0], y + dir[k][1]]);
        }
      }
    setMo(initMo);
  };

  const memo = (xx: number, yy: number) => {
    if (mo[xx][yy]) return;
    const newMm = Array.from(mm);
    newMm[xx][yy] = (newMm[xx][yy] + 1) % 3;
    setMm(newMm);
  };

  const newAllies = (i: number) => {
    if (allies.length > 3) return;
    setAllies((a) => [...a, i]);
    setHps((h) => [...h, 50]);
    setOptions((o) => [...o, [0, 1]]);
  };

  useEffect(() => {
    setMap();
  }, []);

  useEffect(() => {
    setMineswiper();
  }, [mp]);

  useEffect(() => {
    setMapOpen();
  }, [ms]);

  useEffect(() => {
    if (!isBattle && isAllyOpen === -1 && !gameOver) {
      setIsPlaying(true);
      return;
    }
    setIsPlaying(false);
  }, [isBattle, isAllyOpen, gameOver]);

  useEffect(() => {
    if (!isBattle) {
      const newAllies = allies.filter((_, i) => hps[i] > 0);
      const newHps = hps.filter((h) => h > 0);
      const newOptions = options.filter((_, i) => hps[i] > 0);
      setHps(newHps);
      setAllies(newAllies);
      setOptions(newOptions);
    }
  }, [isBattle]);

  return (
    <>
      <div
        className={`w-screen h-screen flex items-center justify-center p-3 bg-blue-200 ${isEffect && "animate-scale"}`}
      >
        <div className="w-full max-w-[700px] aspect-square grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[2px] justify-center items-center select-none">
          {mp.map((line, i) =>
            line.map((cell, j) => (
              <div
                className={`${!mo[i][j] && "hover:animate-hovercell"} w-full h-full relative aspect-square`}
                key={i * 10000 + j}
              >
                <div
                  className={cc([
                    "w-full h-full flex items-center justify-center font-bold cell",
                    ms[i][j].hasItem && cell === 0 && "text-blue-400",
                    mo[i][j] && "opened-cell",
                    mo[i][j] && cell === 1 && "mine-cell",
                    mo[i][j] && cell === 2 && "item-cell",
                    mo[i][j] && cell === 3 && "ally-cell",
                    (!mo[i][j] || (cell === 0 && ms[i][j].count === 0)) && "text-transparent",
                  ])}
                  style={{ animationDelay: `${(i + j) / 10}s` }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    memo(i, j);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    open(i, j);
                  }}
                >
                  {/* {[ms[i][j].count, "!", "♥", "🥰"][cell]} */}
                  {mo[i][j] ? [ms[i][j].count, "!", "♥", "🥰"][cell] : "."}
                </div>
                {!mo[i][j] && mm[i][j] > 0 && (
                  <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center pointer-events-none">
                    {mm[i][j] === 1 && <div className="text-red-400">▲</div>}
                    {mm[i][j] === 2 && <div className="text-blue-400">▲</div>}
                    {mm[i][j] === 3 && <div className="text-yellow-400">▲</div>}
                  </div>
                )}
              </div>
            )),
          )}
        </div>
      </div>
      <AnimatePresence>
        {isBattle && (
          <Battle
            endBattle={() => setIsBattle(false)}
            hps={hps}
            setHps={setHps}
            allies={allies}
            options={options}
            gameOver={() => setGameOver(true)}
          />
        )}
        {isAllyOpen !== -1 && (
          <AllyModal
            setAllies={newAllies}
            ok={allies.length <= 3}
            newAlly={isAllyOpen}
            close={() => setIsAllyOpen(-1)}
          />
        )}
        {gameOver && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={"w-[300px] h-[200px] bg-white md:rounded-2xl flex flex-col items-center justify-center"}
            >
              <div className="font-bold text-2xl">게임오버!</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
