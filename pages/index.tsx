import AllyModal from "components/AllyModal";
import Battle from "components/Battle";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import allies_info from "../scripts/allies_info.json";
import { AnimatePresence } from "framer-motion";

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

  const [hps, setHps] = useState([50, 50, 50, 50]);

  const [isEffect, setIsEffect] = useState(false);

  const [isBattle, setIsBattle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
            if (mp[i + dir[k][0]][j + dir[k][1]] === CELL.item) h = true;
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
    if (!isPlaying) return;
    const a = [[xx, yy]];
    const initMo = Array.from(mo);
    initMo[a[0][0]][a[0][1]] = true;
    if (mp[a[0][0]][a[0][1]] === CELL.monster) {
      setIsEffect(true);
      setTimeout(() => {
        setIsBattle(true);
        setIsEffect(false);
      }, 1000);
    }

    if (mp[a[0][0]][a[0][1]] === CELL.ally) {
      //setIsEffect(true);
      setTimeout(() => {
        setIsAllyOpen(Math.floor(Math.random() * allies_info.length - 1));
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
    if (!isBattle && isAllyOpen === -1 && mo.some((m) => m.some((mm) => mm))) {
      setIsPlaying(true);
      return;
    }
    setIsPlaying(false);
  }, [mo, isBattle, isAllyOpen]);

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
                  className={`w-full h-full flex items-center justify-center font-bold
                cell
                ${mo[i][j] && "opened-cell"}
                ${mo[i][j] && cell === 1 && "mine-cell"}
                ${mo[i][j] && cell === 2 && "item-cell"}
                ${mo[i][j] && cell === 3 && "ally-cell"}
                ${(!mo[i][j] || (cell === 0 && ms[i][j].count === 0)) && "text-transparent"}
                `}
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
        {isBattle && <Battle endBattle={() => setIsBattle(false)} hps={hps} setHps={setHps} allies={allies} />}
        {isAllyOpen !== -1 && <AllyModal />}
      </AnimatePresence>
    </>
  );
};

export default Home;
