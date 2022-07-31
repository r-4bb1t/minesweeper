import "styles/taiwindcss.css";
import "styles/globals.css";
import { useEffect } from "react";
import getConfig from "next/config";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const { publicRuntimeConfig } = getConfig();

  useEffect(() => {
    console.log(`work on: ${publicRuntimeConfig.VERCEL_ENV}`);
    console.log(`git commit: ${publicRuntimeConfig.COMMIT_SHA}`);
  }, [publicRuntimeConfig.COMMIT_SHA, publicRuntimeConfig.VERCEL_ENV]);

  useEffect(() => {
    const script = document.createElement("script");
    const div = document.getElementById("supportByBMC");
    script.setAttribute("src", "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js");
    script.setAttribute("data-name", "BMC-Widget");
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-id", "r4bb1t");
    script.setAttribute("data-description", "Support me on Buy me a coffee!");
    script.setAttribute("data-message", "안녕하세요! 이 게임이 마음에 드셨나요?");
    script.setAttribute("data-color", "#FF5F5F");
    script.setAttribute("data-position", "Right");
    script.setAttribute("data-x_margin", "18");
    script.setAttribute("data-y_margin", "18");

    script.onload = function () {
      var evt = document.createEvent("Event");
      evt.initEvent("DOMContentLoaded", false, false);
      window.dispatchEvent(evt);
    };

    div!.appendChild(script);
  }, []);

  return (
    <>
      <Head>
        <meta></meta>
      </Head>
      <Component {...pageProps} />
      <div id="supportByBMC"></div>
    </>
  );
}

export default MyApp;
