import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Theme } from "../ThemeTypes";
import { Montserrat, Open_Sans } from "next/font/google";
import { createContext, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { BackendFailedPage, MainNav, DownloadBackendPage } from "../components";
import {
  checkForNewBackend,
  checkIfStandaloneBackendExists,
  checkIfBackendIsStandalone,
  dummyFunction,
  reloadBackend,
  startBackend,
  recursiveCheck,
  getInstalledThemes,
} from "../backend";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--opensans",
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
  const [dummyResult, setDummyResult] = useState<boolean>(false);
  const [backendExists, setBackendExists] = useState<boolean>(false);
  const [newBackendVersion, setNewBackend] = useState<string>("");
  const [showNewBackendPage, setShowNewBackend] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    // Checking for updates
    checkIfBackendIsStandalone().then((isStandalone) => {
      if (isStandalone) {
        checkForNewBackend().then((newStandalone) => {
          if (newStandalone) {
            setNewBackend(newStandalone as string);
            setShowNewBackend(true);
          }
        });
      }
    });

    refreshBackendExists();

    // This actually initializes the themes and such
    recheckDummy();
  }, []);

  async function onUpdateFinish() {
    refreshThemes();
    setShowNewBackend(false);
    setNewBackend("");
  }
  async function recheckDummy() {
    recursiveCheck(dummyFuncTest, () => refreshThemes(true), startBackend);
  }

  async function refreshBackendExists() {
    checkIfStandaloneBackendExists().then((value) => setBackendExists(value));
  }

  async function dummyFuncTest() {
    return dummyFunction()
      .then((data) => {
        if (data.success) {
          setDummyResult(data.result);
          return true;
        }
        setDummyResult(false);
        return false;
      })
      .catch(() => {
        setDummyResult(false);
        return false;
      });
  }

  async function refreshThemes(reset: boolean = false) {
    refreshBackendExists();
    dummyFuncTest();

    const promise = reset ? reloadBackend() : getInstalledThemes();
    promise.then((data) => {
      if (data) {
        setThemes(data.sort());
      }
    });
    return;
  }

  return (
    <themeContext.Provider value={{ themes, setThemes, refreshThemes }}>
      <div
        className={`overflow-y-hidden dark w-full min-h-screen h-full flex flex-col bg-bgDark dark:text-textDark ${montserrat.variable} ${openSans.variable}`}
      >
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={"dark"}
        />
        {showNewBackendPage || (!backendExists && !dummyResult) ? (
          <>
            <DownloadBackendPage
              onboarding={!backendExists}
              onUpdateFinish={onUpdateFinish}
              hideWindow={() => setShowNewBackend(false)}
              backendVersion={newBackendVersion}
            />
          </>
        ) : (
          <>
            {dummyResult ? (
              <>
                <MainNav />
                <main
                  style={{
                    overflowY: router.pathname === "/store" ? "auto" : "scroll",
                  }}
                  className="w-full h-minusNav overflow-y-scroll"
                >
                  <Component {...pageProps} />
                </main>
              </>
            ) : (
              <BackendFailedPage />
            )}
          </>
        )}
      </div>
    </themeContext.Provider>
  );
}
