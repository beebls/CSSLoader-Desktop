import { useContext, useMemo, useState } from "react";
import { themeContext } from "@contexts/themeContext";
import { generatePreset } from "../backend";
import { BiPlus } from "react-icons/bi";
import { LabelledInput, Modal } from "./Primitives";
import { twMerge } from "tailwind-merge";

export function CreatePresetModal() {
  const { themes: localThemeList, refreshThemes } = useContext(themeContext);
  const enabledThemes = useMemo(
    () => localThemeList.filter((e) => e.enabled).length,
    [localThemeList]
  );
  const [presetName, setPresetName] = useState<string>("");
  function createPreset() {
    if (presetName) {
      generatePreset(presetName).then(() => {
        refreshThemes(true);
        setPresetName("");
      });
    }
  }
  return (
    <>
      <Modal
        Content={
          <div className="flex w-full items-end gap-2 px-4 pb-4">
            <LabelledInput
              inputClass="bg-base-5.5-light dark:bg-base-5.5-dark"
              label="Preset Name"
              value={presetName}
              onValueChange={setPresetName}
            />
          </div>
        }
        Footer={
          <button
            onClick={createPreset}
            className={twMerge(
              "font-fancy my-2 mr-2 ml-auto rounded-2xl p-2 px-6 transition-all",
              presetName.length > 0 ? "bg-brandBlue" : "bg-base-5.5-dark"
            )}
            style={{ opacity: presetName.length === 0 ? "0.5" : "1" }}
            disabled={presetName.length === 0}
          >
            Create
          </button>
        }
        title="Create Preset"
        description={`This preset will combine ${
          enabledThemes === 1 ? "the " : "all "
        }${enabledThemes} theme${
          enabledThemes === 1 ? "" : "s"
        } you currently have enabled. Enabling/disabling it will toggle them all at once.`}
        triggerDisabled={enabledThemes === 0}
        Trigger={
          <button
            disabled={enabledThemes === 0}
            className={`out flex w-fit items-center justify-center gap-2 rounded-full border-2 border-[#2e2e2e] px-4 py-2 text-sm font-bold ring-brandBlue transition duration-100 focus:ring-2 ${
              enabledThemes > 0 ? "bg-[#2563eb]" : "pointer-events-none opacity-50"
            }`}
          >
            <BiPlus />
            <span>Create Preset</span>
          </button>
        }
      />
    </>
  );
}