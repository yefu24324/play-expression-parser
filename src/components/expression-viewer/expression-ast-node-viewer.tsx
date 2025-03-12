import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { ASTNode } from "@feiling/expression-parser";
import { tags } from "@lezer/highlight";
import { minimalSetup } from "codemirror";
import { createEffect, createSignal } from "solid-js";
import { Codemirror } from "~/components/codemirror";
import { useThemeContext } from "~/plugins/base/context/theme-context";

export const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#8839EF" },
  { tag: tags.operatorKeyword, color: "#179299" },
  { tag: tags.number, color: "#FE640B" },
  { tag: tags.bool, color: "#FE640B" },
  { tag: tags.variableName, color: "#1E66F5" },
  { tag: tags.string, color: "#40A02B" },
  { tag: tags.paren, color: "#4C4F69" },
  // #7C7F93 {
  // #89DDFF
]);

/**
 * 查看AST Node的结构
 */
export function ASTNodeViewer(props: { node?: ASTNode }) {
  const theme = useThemeContext();
  const [value, setValue] = createSignal<string>("");

  function extensions() {
    const result: Extension[] = [minimalSetup, syntaxHighlighting(highlightStyle), javascript()];
    if (theme.theme() === "dark") {
      result.push(
        EditorView.theme({
          "&": {
            fontSize: "14px",
            fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
          "& .cm-scroller": {
            fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
          "&.cm-focused": {
            outline: "unset",
          },
          "& .cm-cursor": {
            borderLeft: "1.5px solid #f5f5f5",
          },
        }),
      );
    } else {
      result.push(
        EditorView.theme({
          "&": {
            fontSize: "14px",
            fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
          "& .cm-scroller": {
            fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
          "&.cm-focused": {
            outline: "unset",
          },
          "& .cm-cursor": {
            borderLeft: "1.5px",
          },
        }),
      );
    }
    return result;
  }
  createEffect(() => {
    if (props.node) {
      setValue(JSON.stringify(props.node, null, 2));
    } else {
      setValue("");
    }
  });
  return (
    <div class="p-4 pt-6 bg-[#f5f5f5] dark:bg-[#090300] dark:text-neutral-200">
      <div class="">
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14">
          <title>mac程序顶部栏</title>
          <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
            <circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5" />
            <circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5" />
            <circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5" />
          </g>
        </svg>
      </div>
      <Codemirror value={value()} extensions={extensions()} />
    </div>
  );
}
