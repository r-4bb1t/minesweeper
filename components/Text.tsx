import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { WindupChildren, useSkip, Effect, Pause, Pace, useIsFinished } from "windups";
import script from "../scripts/script.json";
import optionscript from "../scripts/options.json";
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
  setEnemyHp: (a: number | any) => void;
  isEnd: boolean;
  allies: number[];
  gaps: number[];
  hps: number[];
}

const Options = ({
  setEnemyHp,
  teamIndex,
  allies,
  nextTeam,
  index,
  setIndex,
  options,
}: {
  setEnemyHp: TextProps["setEnemyHp"];
  teamIndex: TextProps["teamIndex"];
  allies: TextProps["allies"];
  nextTeam: TextProps["nextTeam"];
  index: TextProps["index"];
  setIndex: TextProps["setIndex"];
  options: TextProps["options"];
}) => {
  return options.map((o: number, i: number) => (
    <div
      className="ml-1 hover:bg-white hover:bg-opacity-20 cursor-pointer digital"
      key={i}
      onClick={
        teamIndex < allies.length - 1
          ? () => {
              setEnemyHp((s: number) => s - optionscript[o].attack);
              nextTeam();
            }
          : () => {
              setEnemyHp((s: number) => s - optionscript[o].attack);
              setIndex(script[index].next || 0);
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
  ));
};

const SkipButton = ({ next, myTurn }: { next: () => void; myTurn: boolean }) => {
  const skip = useSkip();
  const isFinished = useIsFinished();
  return (
    <div
      onClick={isFinished && !myTurn ? next : skip}
      className={`w-full h-full absolute top-0 left-0 ${myTurn && isFinished && "pointer-events-none"}`}
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
  setEnemyHp,
  allies,
  gaps,
  hps,
}: TextProps) => {
  const [isFinished, setIsFinished] = useState(false);
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

  return (
    <div className="w-full flex flex-col min-h-0 p-2 h-full max-h-full relative bg-black text-white md:rounded-b-xl flex-shrink">
      <div
        className={cc([
          "w-full px-8 py-4 max-h-full overflow-y-auto",
          (!isFinished || script[index].next) && index % 2 !== 1 && "after-text",
          !isFinished && "is-typing",
        ])}
        ref={textRef}
      >
        {(!isEnd || !(index % 2 === 1)) && (
          <WindupChildren onFinished={() => setIsFinished(true)}>
            <SkipButton next={() => script[index].next && setIndex(script[index].next!)} myTurn={index % 2 === 1} />
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
              ) : (
                "스크립트 끗"
              )}
              {index % 2 === 1 && (
                <span className="digital">{allies_info[allies[teamIndex]].name}은(는) 어떻게 할까?</span>
              )}
            </Pace>
            {index % 2 === 1 ? (
              <>
                <div className="h-2"></div>
                <div className="flex flex-col gap-3 md:gap-0">
                  <Options
                    index={index}
                    teamIndex={teamIndex}
                    nextTeam={nextTeam}
                    setIndex={setIndex}
                    options={options}
                    allies={allies}
                    setEnemyHp={setEnemyHp}
                  />
                </div>
              </>
            ) : !isEnd && "attack" in script[index] ? (
              <>
                <span className="digital">양은 {enemy_attack[script[index].attack!].title}을(를) 시전했다.</span>
                {allies.map((ally, i) => (
                  <>
                    {gaps[i] ? (
                      <>
                        <br key={`br${i}`} />
                        <span key={`span${i}`} className="digital">
                          {allies_info[ally].name}은 체력이 {Math.abs(gaps[i])} {gaps[i] > 0 ? "증가" : "감소"}했다.
                        </span>
                      </>
                    ) : null}
                    {hps[i] <= 0 ? (
                      <>
                        <br key={`_br${i}`} />
                        <span key={`_span${i}`} className="digital">
                          {allies_info[ally].name}는 쓰러졌다.
                        </span>
                      </>
                    ) : null}
                    {gaps.every((g) => g === 0) ? (
                      <>
                        <br key={`__br${i}`} />
                        <span key={`__span${i}`} className="digital">
                          아무 일도 일어나지 않았다.
                        </span>
                      </>
                    ) : null}
                  </>
                ))}
              </>
            ) : (
              <></>
            )}
          </WindupChildren>
        )}
      </div>
    </div>
  );
};

export default React.memo(
  Text,
  (prevProps: TextProps, nextProps: TextProps) => prevProps.teamIndex === nextProps.teamIndex,
);
