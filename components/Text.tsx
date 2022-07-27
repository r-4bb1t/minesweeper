import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { WindupChildren, useSkip, Effect, Pause, Pace, useIsFinished } from "windups";
import script from "../scripts/script.json";
import optionscript from "../scripts/options.json";
import itemscript from "../scripts/items.json";
import enemy_attack from "../scripts/enemy_attack.json";
import cc from "classcat";
import allies_info from "../scripts/allies_info.json";

interface TextProps {
  shake: () => void;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  teamIndex: number;
  nextTeam: () => void;
  options: any;
  items: any;
  setEnemyHp: (a: number | any) => void;
  setItems: (a: { id: number; cnt: number }[] | any) => void;
  isEnd: boolean;
  allies: number[];
  gaps: number[];
  hps: number[];
  flag: boolean;
  setFlag: (f: boolean) => void;
  setHps: Function;
}

const Options = ({
  setEnemyHp,
  teamIndex,
  allies,
  nextTeam,
  index,
  setIndex,
  options,
  items,
  setItems,
  setHps,
}: {
  setEnemyHp: TextProps["setEnemyHp"];
  teamIndex: TextProps["teamIndex"];
  allies: TextProps["allies"];
  nextTeam: TextProps["nextTeam"];
  index: TextProps["index"];
  setIndex: TextProps["setIndex"];
  options: TextProps["options"];
  items: TextProps["items"];
  setItems: TextProps["setItems"];
  setHps: TextProps["setHps"];
}) => {
  return (
    <>
      {options.map((o: number, i: number) => (
        <div
          className="ml-1 hover:bg-white hover:bg-opacity-20 cursor-pointer digital"
          key={i}
          onClick={
            teamIndex < allies.length - 1
              ? () => {
                  setEnemyHp((s: number) => s - optionscript[o].attack);
                  setHps((hps: number[]) =>
                    hps.map((hp, i) => {
                      if (i === teamIndex) hp += optionscript[o].heal;
                      return hp;
                    }),
                  );
                  nextTeam();
                }
              : () => {
                  setEnemyHp((s: number) => s - optionscript[o].attack);
                  setHps((hps: number[]) =>
                    hps.map((hp, i) => {
                      if (i === teamIndex) hp += optionscript[o].heal;
                      return hp;
                    }),
                  );
                  setIndex(script[index].next);
                }
          }
        >
          {">"} {optionscript[o].title[Math.floor(Math.random() * optionscript[o].title.length)]}
          {(optionscript[o].attack > 0 || optionscript[o].heal > 0 || optionscript[o].defence > 0) && (
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
      ))}
      {items.map((o: { id: number; cnt: number }, i: number) => (
        <div
          className="ml-1 hover:bg-white hover:bg-opacity-20 cursor-pointer digital"
          key={i}
          onClick={
            teamIndex < allies.length - 1
              ? () => {
                  setEnemyHp((s: number) => s - itemscript[o.id].attack);
                  setItems((items: { id: number; cnt: number }[]) =>
                    items
                      .map((item) => {
                        if (item.id === o.id) item.cnt--;
                        return item;
                      })
                      .filter((item: { id: number; cnt: number }) => item.cnt > 0),
                  );
                  setHps((hps: number[]) =>
                    hps.map((hp, i) => {
                      if (i === teamIndex) hp = Math.min(itemscript[o.id].heal + hp, 50);
                      return hp;
                    }),
                  );
                  nextTeam();
                }
              : () => {
                  setEnemyHp((s: number) => s - itemscript[o.id].attack);
                  setItems((items: { id: number; cnt: number }[]) =>
                    items
                      .map((item) => {
                        if (item.id === o.id) item.cnt--;
                        return item;
                      })
                      .filter((item: { id: number; cnt: number }) => item.cnt > 0),
                  );
                  setHps((hps: number[]) =>
                    hps.map((hp, i) => {
                      if (i === teamIndex) hp = Math.min(itemscript[o.id].heal + hp, 50);
                      return hp;
                    }),
                  );
                  setIndex(script[index].next);
                }
          }
        >
          {o && (
            <div className="flex items-center gap-2">
              {">"}
              <img src={`/assets/items/${itemscript[o.id].src}`} className="w-4 h-4" />
              <span>
                {itemscript[o.id].title}
                {(itemscript[o.id].attack > 0 || itemscript[o.id].heal > 0 || itemscript[o.id].defence > 0) && (
                  <>
                    {itemscript[o.id].attack > 0 && (
                      <span className="text-red-400 digital text-sm"> {itemscript[o.id].attack} 공격</span>
                    )}
                    {itemscript[o.id].heal > 0 && (
                      <span className="text-green-400 digital text-sm"> {itemscript[o.id].heal} 회복</span>
                    )}
                    {itemscript[o.id].defence > 0 && (
                      <span className="text-blue-400 digital text-sm"> {itemscript[o.id].defence} 방어</span>
                    )}
                  </>
                )}
                <small> {o.cnt}개 남음</small>
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

const SkipButton = ({ isEnd, next, myTurn }: { isEnd: boolean; next: () => void; myTurn: boolean }) => {
  const skip = useSkip();
  const isFinished = useIsFinished();
  return (
    <div
      onClick={isFinished && (!myTurn || isEnd) ? next : skip}
      className={cc(["w-full h-full absolute top-0 left-0", myTurn && !isEnd && isFinished && "pointer-events-none"])}
    />
  );
};

const Text = ({
  isEnd,
  shake,
  index,
  setIndex,
  teamIndex,
  nextTeam,
  options,
  items,
  setEnemyHp,
  allies,
  gaps,
  hps,
  flag,
  setFlag,
  setItems,
  setHps,
}: TextProps) => {
  const [isFinished, setIsFinished] = useState(false);
  const [isDead, setIsDead] = useState(Array.from({ length: allies.length }, () => false));
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFinished(false);
  }, [index]);

  useEffect(() => {
    const interval = setInterval(
      () => textRef.current && textRef.current!.scrollTo({ top: 20000, behavior: "smooth" }),
      1000,
    );
    if (isFinished) clearInterval(interval);
  }, [isFinished]);

  useEffect(() => console.log("Rerendered"));

  useEffect(() => {
    if (hps[teamIndex] <= 0) {
      teamIndex < allies.length - 1 ? nextTeam() : setIndex(script[index].next || 0);
      setIsDead((d) => d.map((_, i) => hps[i] <= 0));
    }
  }, [teamIndex]);

  return (
    <div className="w-full flex flex-col min-h-0 p-2 h-full max-h-full relative bg-black text-white md:rounded-b-xl flex-shrink">
      <div
        className={cc([
          "w-full px-8 py-4 max-h-full overflow-y-auto",
          (!isFinished || (script[index].next && (index % 2 === 0 || isEnd))) && flag && "after-text",
          !isFinished && "is-typing",
        ])}
        ref={textRef}
      >
        {flag && (
          <WindupChildren onFinished={() => setIsFinished(true)}>
            <SkipButton
              isEnd={isEnd}
              next={() => {
                if (script[index].next) {
                  setIndex(script[index].next);
                }
                if (isEnd) {
                  setIndex(0);
                  setFlag(false);
                }
              }}
              myTurn={index % 2 === 1}
            />
            <Pace ms={50}>
              {isEnd ? (
                <span className="digital">양이 쓰러졌다.</span>
              ) : script[index] ? (
                script[index].texts.map((t, i) => {
                  if (typeof t === "number") {
                    return (
                      <span key={`span${i}`}>
                        <Pause ms={t} />
                        <br />
                      </span>
                    );
                  } else if (t === "/shake") {
                    return <Effect fn={shake} key={`shake${i}`} />;
                  } else
                    return (
                      <span key={`_span${i}`} className="digital">
                        {t}
                      </span>
                    );
                })
              ) : null}
              <span className="hidden">{teamIndex}</span>
              {index % 2 === 1 && !isEnd && teamIndex >= 0 && (
                <span className="digital">{allies_info[allies[teamIndex]].name}는 어떻게 할까?</span>
              )}
              {index % 2 === 1 && !isEnd ? (
                <>
                  <div className="h-2"></div>
                  <div className="flex flex-col gap-3 md:gap-0">
                    <Options
                      index={index}
                      teamIndex={teamIndex}
                      nextTeam={nextTeam}
                      setIndex={setIndex}
                      options={options}
                      items={items}
                      allies={allies}
                      setEnemyHp={setEnemyHp}
                      setItems={setItems}
                      setHps={setHps}
                    />
                  </div>
                </>
              ) : !isEnd && "attack" in script[index] ? (
                <>
                  <span className="digital">양은 {enemy_attack[script[index].attack!].title}을(를) 시전했다.</span>
                  {allies.map((ally, i) => (
                    <>
                      {gaps[i] && !isDead[i] ? (
                        <>
                          <br key={`br${i}`} />
                          <span key={`span${i}`} className="digital">
                            {allies_info[ally].name}는 체력이 {Math.abs(gaps[i])} {gaps[i] > 0 ? "증가" : "감소"}
                            했다.
                          </span>
                        </>
                      ) : null}
                      {hps[i] <= 0 && !isDead[i] ? (
                        <>
                          <br key={`_br${i}`} />
                          <span key={`_span${i}`} className="digital">
                            {allies_info[ally].name}는 쓰러졌다.
                          </span>
                        </>
                      ) : null}
                    </>
                  ))}
                  {gaps.every((g) => g === 0) ? (
                    <>
                      <br key={`__br`} />
                      <span key={`__span`} className="digital">
                        아무 일도 일어나지 않았다.
                      </span>
                    </>
                  ) : null}
                </>
              ) : null}
            </Pace>
          </WindupChildren>
        )}
      </div>
    </div>
  );
};

export default React.memo(
  Text,
  (p: TextProps, n: TextProps) => p.teamIndex === n.teamIndex && p.isEnd === n.isEnd && p.items === n.items,
);
