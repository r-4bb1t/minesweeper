import { useEffect, useState } from "react";
import optionscript from "../scripts/options.json";
import itemscript from "../scripts/items.json";
import { TextProps } from "./Text";
import allies_info from "../scripts/allies_info.json";
import script from "../scripts/script.json";
import { toast } from "react-toastify";

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
  setDefences,
  levels,
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
  setDefences: TextProps["setDefences"];
  levels: TextProps["levels"];
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
                  if (optionscript[o].attack[levels[teamIndex] - 1] > 0) {
                    setEnemyHp((s: number) => s - optionscript[o].attack[levels[teamIndex] - 1]);
                    toast(allies_info[allies[teamIndex]].messages.attack, { containerId: teamIndex });
                    //newMessages[teamIndex] = allies_info[allies[teamIndex]].messages.attack;
                  }
                  if (optionscript[o].heal[levels[teamIndex] - 1] > 0) {
                    setHps((hps: number[]) =>
                      hps.map((hp, ii) => {
                        if (ii === teamIndex) {
                          hp = Math.min(optionscript[o].heal[levels[teamIndex] - 1] + hp, 50);
                          toast(allies_info[allies[teamIndex]].messages.heal, { containerId: teamIndex });
                          //newMessages[ii] = allies_info[allies[ii]].messages.heal;
                        }
                        return hp;
                      }),
                    );
                  }
                  if (optionscript[o].defence[levels[teamIndex] - 1] > 0) {
                    setDefences((defences: number[]) =>
                      defences.map((defence, ii) => {
                        if (ii === teamIndex) {
                          defence = optionscript[o].defence[levels[teamIndex] - 1];
                        }
                        return defence;
                      }),
                    );
                  }

                  nextTeam();
                }
              : () => {
                  if (optionscript[o].attack[levels[teamIndex] - 1] > 0) {
                    setEnemyHp((s: number) => s - optionscript[o].attack[levels[teamIndex] - 1]);
                    toast(allies_info[allies[teamIndex]].messages.attack, { containerId: teamIndex });
                    //newMessages[teamIndex] = allies_info[allies[teamIndex]].messages.attack;
                  }
                  if (optionscript[o].heal[levels[teamIndex] - 1] > 0) {
                    setHps((hps: number[]) =>
                      hps.map((hp, ii) => {
                        if (ii === teamIndex) {
                          hp = Math.min(optionscript[o].heal[levels[teamIndex] - 1] + hp, 50);
                          toast(allies_info[allies[teamIndex]].messages.heal, { containerId: teamIndex });
                          //newMessages[ii] = allies_info[allies[ii]].messages.heal;
                        }
                        return hp;
                      }),
                    );
                  }
                  if (optionscript[o].defence[levels[teamIndex] - 1] > 0) {
                    setDefences((defences: number[]) =>
                      defences.map((defence, ii) => {
                        if (ii === teamIndex) {
                          defence = optionscript[o].defence[levels[teamIndex] - 1];
                        }
                        return defence;
                      }),
                    );
                  }
                  //setMessages(newMessages);
                  setIndex(script[index].next);
                }
          }
        >
          {">"} {optionscript[o].title[Math.floor(Math.random() * optionscript[o].title.length)]}
          {(optionscript[o].attack[levels[teamIndex] - 1] > 0 ||
            optionscript[o].heal[levels[teamIndex] - 1] > 0 ||
            optionscript[o].defence[levels[teamIndex] - 1] > 0) && (
            <>
              {optionscript[o].attack[levels[teamIndex] - 1] > 0 && (
                <span className="text-red-400 digital text-sm">
                  {" "}
                  {optionscript[o].attack[levels[teamIndex] - 1]} 공격
                </span>
              )}
              {optionscript[o].heal[levels[teamIndex] - 1] > 0 && (
                <span className="text-green-400 digital text-sm">
                  {" "}
                  {optionscript[o].heal[levels[teamIndex] - 1]} 회복
                </span>
              )}
              {optionscript[o].defence[levels[teamIndex] - 1] > 0 && (
                <span className="text-blue-400 digital text-sm">
                  {" "}
                  {optionscript[o].defence[levels[teamIndex] - 1]} 방어
                </span>
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
                  if (itemscript[o.id].attack > 0) {
                    setEnemyHp((s: number) => s - itemscript[o.id].attack);
                    toast(allies_info[allies[teamIndex]].messages.attack, { containerId: teamIndex });
                  }
                  setItems((items: { id: number; cnt: number }[]) =>
                    items
                      .map((item) => {
                        if (item.id === o.id) item.cnt--;
                        return item;
                      })
                      .filter((item: { id: number; cnt: number }) => item.cnt > 0),
                  );
                  setHps((hps: number[]) =>
                    hps.map((hp, ii) => {
                      if (ii === teamIndex) {
                        hp = Math.min(itemscript[o.id].heal + hp, 50);
                        toast(allies_info[allies[teamIndex]].messages.heal, { containerId: teamIndex });
                      }
                      return hp;
                    }),
                  );
                  if (itemscript[o.id].defence > 0) {
                    setDefences((defences: number[]) =>
                      defences.map((defence, ii) => {
                        if (ii === teamIndex) {
                          defence = itemscript[o.id].defence;
                        }
                        return defence;
                      }),
                    );
                  }
                  nextTeam();
                }
              : () => {
                  setEnemyHp((s: number) => s - itemscript[o.id].attack);
                  toast(allies_info[allies[teamIndex]].messages.attack, { containerId: teamIndex });
                  setItems((items: { id: number; cnt: number }[]) =>
                    items
                      .map((item) => {
                        if (item.id === o.id) item.cnt--;
                        return item;
                      })
                      .filter((item: { id: number; cnt: number }) => item.cnt > 0),
                  );
                  setHps((hps: number[]) =>
                    hps.map((hp, ii) => {
                      if (ii === teamIndex) {
                        hp = Math.min(itemscript[o.id].heal + hp, 50);
                        toast(allies_info[allies[teamIndex]].messages.heal, { containerId: teamIndex });
                      }
                      return hp;
                    }),
                  );
                  if (itemscript[o.id].defence > 0) {
                    setDefences((defences: number[]) =>
                      defences.map((defence, ii) => {
                        if (ii === teamIndex) {
                          defence = itemscript[o.id].defence;
                        }
                        return defence;
                      }),
                    );
                  }
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

export default Options;
