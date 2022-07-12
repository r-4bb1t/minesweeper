import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WindupChildren, useSkip, Effect, Pause, Pace, useIsFinished } from "windups";
import script from "./script.json";

interface TextProps {
  shake: () => void;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
}

const SkipButton = ({ next, hasOption }: { next: () => void; hasOption: boolean }) => {
  const skip = useSkip();
  const isFinished = useIsFinished();
  return (
    <div
      onClick={isFinished ? (hasOption ? () => {} : next) : skip}
      className={`w-full h-full absolute top-0 left-0 ${hasOption && isFinished && "pointer-events-none"}`}
    />
  );
};

const Text = ({ shake, index, setIndex }: TextProps) => {
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    setIsFinished(false);
  }, [index]);
  return (
    <div className="w-full h-[250px] flex flex-col">
      <div className="w-full h-full bg-violet-200 md:rounded-b-2xl overflow-y-auto px-2 py-2">
        <div
          className={`w-full px-8 py-8 ${(!isFinished || script[index].next) && "after-text"} ${
            !isFinished && "is-typing"
          }`}
        >
          <WindupChildren onFinished={() => setIsFinished(true)}>
            <SkipButton
              next={() => script[index].next && setIndex(script[index].next!)}
              hasOption={"options" in script[index]}
            />
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
                    } else return <span key={i}>{t}</span>;
                  })
                : "스크립트 끗"}
            </Pace>
            {script[index].options && <div className="h-2"></div>}
            {script[index].options?.map((o, i) => (
              <div
                className="ml-1 hover:bg-white hover:bg-opacity-20 font-bold cursor-pointer"
                key={i}
                onClick={() => setIndex(o.index)}
              >
                {">"} {o.text}
              </div>
            ))}
          </WindupChildren>
        </div>
      </div>
    </div>
  );
};

export default Text;
