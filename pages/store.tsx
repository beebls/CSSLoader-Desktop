import { useContext, useEffect, useRef } from "react";
import * as python from "../backend";
import { themeContext } from "./_app";

export default function Store() {
  const storeRef = useRef<HTMLIFrameElement>();

  const { refreshThemes } = useContext(themeContext);

  useEffect(() => {
    function listener(event: any) {
      if (
        event.origin !== "https://beta.deckthemes.com" &&
        event.origin !== "https://deckthemes.com"
      )
        return;

      if (event.data.action === "isThisDesktopApp") {
        storeRef.current?.contentWindow?.postMessage(
          "enableDesktopAppMode",
          event.origin
        );
      }

      if (event.data.action === "installTheme") {
        python.downloadThemeFromUrl(event.data.payload).then(() => {
          python.toast(`Theme Installed`);
          refreshThemes();
          storeRef.current?.contentWindow?.postMessage(
            "themeInstalled",
            event.origin
          );
        });
      }
    }
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);
  return (
    <>
      <div className="h-full flex-grow flex flex-col">
        <iframe
          // @ts-ignore
          ref={storeRef}
          src="https://beta.deckthemes.com"
          // src="http://localhost:3001"
          className="w-full h-full flex-grow"
        />
      </div>
    </>
  );
}
