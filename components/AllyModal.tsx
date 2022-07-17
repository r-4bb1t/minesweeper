import cc from "classcat";
const AllyModal = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center">
      <div
        className={cc(["w-full h-full max-w-[450px] md:h-[650px] bg-white md:rounded-2xl flex flex-col items-center"])}
      ></div>
    </div>
  );
};

export default AllyModal;
