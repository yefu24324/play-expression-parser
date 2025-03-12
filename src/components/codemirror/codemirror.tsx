import { EditorSelection, type Extension, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { createEffect, onMount } from "solid-js";

export interface CodemirrorProps {
  /** 编辑器内容 */
  value: string;
  /** codemirror原生参数 */
  extensions?: Extension;

  /** 事件 */
  onChange?: (value: string) => void;
}

export function Codemirror(props: CodemirrorProps) {
  let elRef: HTMLDivElement | undefined;
  let view!: EditorView;
  onMount(() => {
    view = new EditorView({
      doc: props.value,
      extensions: props.extensions,
      parent: elRef,
    });
  });

  createEffect(() => {
    if (!view) return;
    view.dispatch({
      effects: StateEffect.reconfigure.of(props.extensions || []),
    });
  });

  createEffect(() => {
    if (!view) return;
    if (view.composing) {
      // IME fix
      return;
    }

    view.dispatch({ selection: EditorSelection.cursor(0) });
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: props.value },
      selection: view.state.selection,
      scrollIntoView: true,
    });
  });

  return <div ref={elRef} />;
}
