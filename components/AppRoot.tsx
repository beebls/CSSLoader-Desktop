import { ToastContainer } from "react-toastify";
import { MainNav } from "./Nav";
import { DownloadBackendPage } from "./DownloadBackendPage";
import { AppProps } from "next/app";
import { useContext, useEffect, useRef } from "react";
import { fontContext } from "@contexts/FontContext";
import { BackendFailedPage } from "./BackendFailedPage";
import { backendStatusContext } from "@contexts/backendStatusContext";
import { themeContext } from "@contexts/themeContext";
import { osContext } from "@contexts/osContext";
import { useRouter } from "next/router";

export function AppRoot({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { montserrat, openSans } = useContext(fontContext);
  const { isWindows } = useContext(osContext);
  const {
    dummyResult,
    backendExists,
    showNewBackendPage,
    newBackendVersion,
    setNewBackend,
    setShowNewBackend,
  } = useContext(backendStatusContext);

  const { refreshThemes } = useContext(themeContext);

  async function onUpdateFinish() {
    refreshThemes();
    setShowNewBackend(false);
    setNewBackend("");
  }

  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = 0;
    }
  }, [router.asPath]);

  return (
    // overflow-hidden rounded-b-lg
    <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden bg-base-6-dark">
      <div className="relative top-8 overflow-hidden rounded-b-lg">
        <div
          ref={scrollableContainerRef}
          // A lot of this codebase is from the DeckThemes codebase, which has a light and dark mode, however this app only has a dark mode, so we put the dark class here incase we copy over things that have both styles
          className={`dark relative flex h-[calc(100vh-32px)] flex-col bg-base-6-dark text-textDark ${montserrat} ${openSans} ${
            router.pathname === "/store"
              ? // 4px margin to prevent scrolling iframe on store page still
                "mr-[4px] overflow-y-hidden"
              : "mr-[4px] overflow-y-scroll pr-[8px]"
          }`}
        >
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            toastClassName="rounded-xl border-2 border-borders-base1-light bg-base-3-light transition hover:border-borders-base2-light dark:border-borders-base1-dark dark:bg-base-3-dark hover:dark:border-borders-base2-dark"
            bodyClassName="rounded-xl font-fancy text-black dark:text-white text-sm"
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={"dark"}
          />
          {dummyResult && <MainNav />}
          <main
            className={`flex h-min flex-1 flex-grow flex-col ${
              router.pathname === "/store"
                ? ""
                : "page-shadow ml-4 mt-4 mb-4 rounded-3xl border-[1px] border-borders-base3-light bg-base-2-light dark:border-borders-base1-dark dark:bg-base-2-dark"
            }`}
          >
            {isWindows && (showNewBackendPage || (!backendExists && !dummyResult)) && (
              <DownloadBackendPage
                onboarding={!backendExists}
                onUpdateFinish={onUpdateFinish}
                hideWindow={() => setShowNewBackend(false)}
                backendVersion={newBackendVersion}
              />
            )}
            {dummyResult ? (
              <>
                <Component {...pageProps} />
              </>
            ) : (
              <BackendFailedPage />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
