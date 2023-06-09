import { VFC } from "react";

import { open } from "@tauri-apps/api/dialog";

import * as python from "../backend";
import { ThemePatchComponent } from "../ThemeTypes";
import { FaFolder } from "react-icons/fa";

export const PatchComponent = ({
  data,
  selectedLabel,
  themeName,
  patchName,
  bottomSeparatorValue,
}: {
  data: ThemePatchComponent;
  selectedLabel: string;
  themeName: string;
  patchName: string;
  bottomSeparatorValue: any;
}) => {
  function setComponentAndReload(value: string) {
    python.resolve(
      python.setComponentOfThemePatch(
        themeName,
        patchName,
        data.name, // componentName
        value
      ),
      () => {
        python.getInstalledThemes();
      }
    );
  }
  if (selectedLabel === data.on) {
    // The only value that changes from component to component is the value, so this can just be re-used
    switch (data.type) {
      case "image-picker":
        // This makes things compatible with people using HoloISO or who don't have the user /deck/
        // These have to
        return (
          <div className="w-full pr-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() =>
                python.resolve(python.fetchThemePath(), (rootPath: string) => {
                  open({
                    directory: false,
                    multiple: false,
                    filters: [
                      {
                        name: "Image File",
                        extensions: [
                          "svg",
                          "png",
                          "jpg",
                          "jpeg",
                          "avif",
                          "webp",
                          "gif",
                        ],
                      },
                    ],
                    defaultPath: rootPath,
                  }).then((path) => {
                    if (!path) {
                      python.toast("Error!", "No File Selected");
                      return;
                    }
                    if (typeof path === "string") {
                      if (!path?.includes(rootPath)) {
                        python.toast(
                          "Invalid File",
                          "Images must be within themes folder"
                        );
                        return;
                      }
                      if (!/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(path)) {
                        python.toast("Invalid File", "Must be an image file");
                        return;
                      }
                      const relativePath = path
                        .split(`${rootPath}`)[1]
                        .slice(1);
                      setComponentAndReload(relativePath);
                    }
                  });
                })
              }
            >
              <span>{data.name}</span>
              <div
                style={{
                  marginLeft: "auto",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaFolder />
              </div>
            </button>
          </div>
        );
      case "color-picker":
        return (
          <>
            <div className="flex items-center justify-between w-full pr-4">
              <span>{data.name}</span>
              <input
                type="color"
                defaultValue={data.value}
                onBlur={(e) => {
                  setComponentAndReload(e.target.value);
                }}
              />
            </div>
          </>
        );
    }
  }
  return null;
};
