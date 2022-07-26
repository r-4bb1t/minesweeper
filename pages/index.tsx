import AllyModal from "components/AllyModal";
import Battle from "components/Battle";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import allies_info from "../scripts/allies_info.json";
import optionscript from "../scripts/options.json";
import itemscript from "../scripts/items.json";
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
  const [items, setItems] = useState([] as { id: number; cnt: number }[]);

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
        setIsAllyOpen(Math.floor(Math.random() * allies_info.length));
        //setIsEffect(false);
      }, 1000);
    }

    if (mp[a[0][0]][a[0][1]] === CELL.item) {
      const newItem = Math.floor(Math.random() * itemscript.length);
      if (items.some((item) => item.id === newItem))
        setItems((items) =>
          items.map((i) => {
            if (i.id === newItem) i.cnt++;
            return i;
          }),
        );
      else setItems((items) => [...items, { id: newItem, cnt: 1 }]);
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
        className={`w-screen h-screen overflow-y-auto flex flex-col justify-center items-center p-3 bg-blue-200 gap-5 ${
          isEffect && "animate-scale"
        }`}
      >
        <div className="w-screen h-screen fixed inset-0 pointer-events-none z-[100000] opacity-5 bg-blend-screen _bg-[url(/assets/noise.gif)] bg-repeat" />
        <div className="w-full h-16 flex flex-col items-center gap-1 mt-4">
          <div className="w-64 h-16 grid grid-cols-4">
            {[...Array(4)].map((_, i) => {
              return allies.length > i ? (
                <div className="aspect-square w-full relative group" key={i}>
                  <div
                    className={cc([
                      "absolute inset-2 top-auto bg-hp-danger",
                      hps[i] > 10 && "bg-hp-warn",
                      hps[i] > 30 && "bg-hp-good",
                    ])}
                    style={{ height: `calc(${(hps[i] / 50) * 100}% - 1rem)` }}
                  ></div>
                  <div className="absolute inset-2">
                    <img src={allies_info[allies[i]].face} className="w-full h-full object-cover z-[3000]" />
                  </div>
                  <div className="absolute">
                    <img src="/assets/frame.png" className="object-contain z-[3000]" />
                  </div>
                  <div className="absolute top-[calc(100%+0.5rem)] hidden group-hover:block bg-slate-900 bg-opacity-60 p-3 z-[5000] text-white">
                    {allies_info[allies[i]].name}의 스킬
                    {options[i].map(
                      (o, i) =>
                        o !== 0 && (
                          <div key={i} className="whitespace-nowrap">
                            {optionscript[o].title[Math.floor(Math.random() * optionscript[o].title.length)]}
                            {(optionscript[o].attack > 0 ||
                              optionscript[o].heal > 0 ||
                              optionscript[o].defence > 0) && (
                              <>
                                {optionscript[o].attack > 0 && (
                                  <span className="text-red-400 digital text-sm"> {optionscript[o].attack} 공격</span>
                                )}
                                {optionscript[o].heal > 0 && (
                                  <span className="text-green-400 digital text-sm"> {optionscript[o].heal} 회복</span>
                                )}
                                {optionscript[o].defence > 0 && (
                                  <span className="text-blue-400 digital text-sm"> {optionscript[o].defence} 방어</span>
                                )}
                              </>
                            )}
                          </div>
                        ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-square w-full relative" key={i}>
                  <div className="absolute inset-2 bg-slate-200" />
                  <img src="/assets/frame.png" className="absolute inset-0 w-full h-full]" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <div className="w-fit grid grid-cols-10 gap-1">
            {[...Array(10)].map((_, i) => {
              return items[i] ? (
                <div className="w-8 h-8 relative group" key={i}>
                  <div className="absolute inset-1 bg-slate-200" />
                  <div className="absolute inset-0">
                    <img
                      src={`/assets/items/${itemscript[items[i].id].src}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 text-sm w-4 h-4 items-center justify-center flex">
                    {items[i].cnt}
                  </div>
                  <div className="absolute top-[calc(100%+0.5rem)] hidden group-hover:block bg-slate-900 bg-opacity-60 p-3 z-[5000] text-white whitespace-nowrap">
                    {itemscript[items[i].id].title}의 효과
                    <br />
                    {(itemscript[items[i].id].attack > 0 ||
                      itemscript[items[i].id].heal > 0 ||
                      itemscript[items[i].id].defence > 0) && (
                      <>
                        {itemscript[items[i].id].attack > 0 && (
                          <span className="text-red-400 digital text-sm"> {itemscript[items[i].id].attack} 공격</span>
                        )}
                        {itemscript[items[i].id].heal > 0 && (
                          <span className="text-green-400 digital text-sm"> {itemscript[items[i].id].heal} 회복</span>
                        )}
                        {itemscript[items[i].id].defence > 0 && (
                          <span className="text-blue-400 digital text-sm"> {itemscript[items[i].id].defence} 방어</span>
                        )}
                      </>
                    )}
                  </div>
                  <img src="/assets/itemframe.png" className="absolute inset-0 w-full h-full" />
                </div>
              ) : (
                <div className="w-8 h-8 relative" key={i}>
                  <div className="absolute inset-1 bg-slate-200" />
                  <img
                    src="/assets/itemframe.png"
                    className="absolute inset-0 w-full h-full [image-rendering:pixelated]"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full max-w-[550px] aspect-square grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[2px] justify-center items-center select-none">
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
                  {mo[i][j]
                    ? [
                        ms[i][j].count,
                        "!",
                        <img src={`/assets/itembox.gif?${i * 10000 + j}`} key={i * 10000 + j} />,
                        "🥰",
                      ][cell]
                    : "."}
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
            items={items}
            gameOver={() => setGameOver(true)}
            setItems={setItems}
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
