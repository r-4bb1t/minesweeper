import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { WindupChildren, useSkip, Effect, Pause, Pace, useIsFinished } from "windups";
import script from "./script.json";
import optionscript from "./options.json";
import cc from "classcat";

interface TextProps {
  shake: () => void;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  teamIndex: number;
  nextTeam: () => void;
  options: any;
}

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

const Text = ({ shake, index, setIndex, teamIndex, nextTeam, options }: TextProps) => {
  const [isFinished, setIsFinished] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFinished(false);
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => textRef.current!.scrollTo({ top: 20000, behavior: "smooth" }), 1000);
    if (isFinished) clearInterval(interval);
  }, [isFinished]);

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
        <WindupChildren onFinished={() => setIsFinished(true)}>
          <SkipButton next={() => script[index].next && setIndex(script[index].next!)} myTurn={index % 2 === 1} />
          <Pace ms={50}>
            {script[index]
              ? script[index].texts.map((t, i) => {
                  if (typeof t === "number") {
                    return (
                      <>
                        <Pause ms={t} />
                        <br />
                      </>
                    );
                  } else if (t === "/shake") {
                    return <Effect fn={shake} key={i} />;
                  } else
                    return (
                      <span key={i} className="digital">
                        {t}
                      </span>
                    );
                })
              : "스크립트 끗"}
            {index % 2 === 1 && (
              <span className="digital">{["가람이", "나람이", "다람이", "라람이"][teamIndex % 4]}는 어떻게 할까?</span>
            )}
          </Pace>
          {index % 2 === 1 && (
            <>
              <div className="h-2"></div>
              {options.map((o: number, i: number) => (
                <div
                  className="ml-1 hover:bg-white hover:bg-opacity-20 cursor-pointer digital"
                  key={i}
                  onClick={teamIndex < 3 ? nextTeam : () => setIndex(script[index].next || 0)}
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
            </>
          )}
        </WindupChildren>
      </div>
    </div>
  );
};

export default Text;
