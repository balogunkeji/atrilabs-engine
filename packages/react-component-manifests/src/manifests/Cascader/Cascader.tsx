import React, { forwardRef, useCallback, useState } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";

const checkHasChildren = (
  currentLevel: number,
  currentSelection: string,
  options: {
    level: number;
    parent: string;
    children: string[];
  }[]
) => {
  // Get the clicked options
  const optionsOnCurrentLevel = options.filter(
    (option) =>
      option.level === currentLevel + 1 && option.parent === currentSelection
  );
  return optionsOnCurrentLevel.length > 0 ? true : false;
};

const showCascaderOptions = (
  setCascadeOptions: React.Dispatch<React.SetStateAction<string[][]>>,
  cascadeOptions: string[][],
  currentLevel: number,
  currentSelection: string,
  options: {
    level: number;
    parent: string;
    children: string[];
  }[]
) => {
  // Get the clicked options
  const optionsOnCurrentLevel = options.filter(
    (option) =>
      option.level === currentLevel + 1 && option.parent === currentSelection
  );

  // If level 0 is clicked and options are empty reset
  if (currentLevel === 0 && optionsOnCurrentLevel.length === 0)
    setCascadeOptions([]);
  // If any level other than 0 is clicked and options are empty reset
  else if (currentLevel !== 0 && optionsOnCurrentLevel.length === 0) {
    const currOptions = [];
    for (let idx = 0; idx < currentLevel; idx++) {
      currOptions.push(cascadeOptions[idx]);
    }
    setCascadeOptions([...currOptions, []]);
  }
  // If there are no options for the current selection return
  if (optionsOnCurrentLevel.length === 0) return;

  // Set children options for root level
  if (currentLevel === 0)
    setCascadeOptions([optionsOnCurrentLevel[0].children]);
  // Set children
  if (currentLevel < cascadeOptions.length) {
    const currOptions = [];
    for (let idx = 0; idx < currentLevel; idx++) {
      currOptions.push(cascadeOptions[idx]);
    }
    setCascadeOptions([...currOptions, optionsOnCurrentLevel[0].children]);
  } else {
    setCascadeOptions([...cascadeOptions, optionsOnCurrentLevel[0].children]);
  }
};

export const Cascader = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      rootOptions: string[];
      options: {
        level: number;
        parent: string;
        children: string[];
      }[];
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  const [expanded, setExpanded] = useState<boolean>(false);
  const [cascadeOptions, setCascadeOptions] = useState<string[][]>([]);

  return (
    <div
      ref={ref}
      className={props.className}
      style={{
        ...props.styles,
        display: "inline-flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      <label
        style={{ position: "relative", width: props.styles.width || "160px" }}
      >
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="down"
          width="0.8em"
          height="0.8em"
          fill="currentColor"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            color: "#ccc",
          }}
        >
          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
        </svg>
        <input
          type="search"
          placeholder="Please select"
          style={{
            padding: "0.5em",
            borderRadius: "5px",
            color: "#ccc",
            border: "1px solid #ccc",
            width: props.styles.width || "160px",
          }}
          onClick={() => setExpanded((expanded) => !expanded)}
        />
      </label>
      {expanded && (
        <div
          style={{
            display: "flex",
            zIndex: "2",
            paddingTop: "0.1em",
            position: "absolute",
            marginTop: "2em",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              padding: "0.1em",
              backgroundColor: "#ffffffff",
            }}
          >
            {props.custom.rootOptions.map((rootOption, index) => (
              <div
                onClick={(e) => {
                  showCascaderOptions(
                    setCascadeOptions,
                    cascadeOptions,
                    0,
                    rootOption,
                    props.custom.options
                  );
                }}
                key={index}
                style={{
                  padding: "0.3em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "1em", color: "rgba(0, 0, 0, 0.7)" }}>
                  {rootOption}
                </span>
                {checkHasChildren(0, rootOption, props.custom.options) && (
                  <span role="img" aria-label="right">
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="right"
                      width="0.8em"
                      height="0.8em"
                      color="#ccc"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
          {cascadeOptions.map((cascadeOption, level) => (
            <div
              key={level}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                padding: "0.1em",
                backgroundColor: "#ffffffff",
              }}
            >
              {cascadeOption.map((option, index) => (
                <div
                  onClick={(e) => {
                    showCascaderOptions(
                      setCascadeOptions,
                      cascadeOptions,
                      level + 1,
                      option,
                      props.custom.options
                    );
                  }}
                  key={index}
                  style={{
                    padding: "0.3em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: "1em", color: "rgba(0, 0, 0, 0.7)" }}
                  >
                    {option}
                  </span>
                  <span role="img" aria-label="right">
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="right"
                      width="0.8em"
                      height="0.8em"
                      color="#ccc"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    rootOptions: { type: "array" },
    options: {
      type: "array_map",
      singleObjectName: "option",
      attributes: [
        { type: "number", fieldName: "level" },
        { type: "text", fieldName: "parent" },
        { type: "array", fieldName: "children" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Cascader", category: "Basics" },
  render: {
    comp: Cascader,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          width: "160px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          rootOptions: [],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      onClick: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Cascader" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Cascader", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
