import "../styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";

import { Theme } from "../ThemeTypes";
import { Montserrat } from "next/font/google";
import { createContext, useState, useEffect } from "react";
import * as python from "../backend";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--montserrat",
});

export const themeContext = createContext<{
  themes: Theme[];
  setThemes: any;
  refreshThemes: any;
}>({
  themes: [],
  setThemes: () => {},
  refreshThemes: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  useEffect(() => {
    refreshThemes();
  }, []);

  function refreshThemes() {
    python.getInstalledThemes().then((data) => {
      if (data) {
        setThemes(data);
      }
    });
  }

  return (
    <themeContext.Provider value={{ themes, setThemes, refreshThemes }}>
      <div
        className={`w-screen min-h-screen h-full bg-bgLight dark:bg-bgDark text-textLight dark:text-textDark ${montserrat.variable}`}>
        <div className='h-16 gap-2 px-2 flex items-center bg-cardLight dark:bg-cardDark'>
          <Image
            src='logo_css_darkmode.png'
            width={48}
            height={48}
            alt='CSSLoader Logo'
          />
          <h1 className={`fancy-font font-semibold text-3xl`}>CSSLoader</h1>
        </div>
        <ToastContainer
          position='bottom-center'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={"dark"}
        />
        <Component {...pageProps} />
      </div>
    </themeContext.Provider>
  );
}
