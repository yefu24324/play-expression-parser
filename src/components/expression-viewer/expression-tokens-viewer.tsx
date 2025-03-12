import { Kind, Lexer, type Token } from "@feiling/expression-parser";
import { For, createEffect, createSignal } from "solid-js";

export function ExpressionTokensViewer(props: { content: string }) {
  const [tokens, setTokens] = createSignal<Token[]>([]);
  createEffect(() => {
    if (!props.content) return;
    try {
      const lexer = new Lexer(props.content);
      setTokens(lexer.lex());
    } catch (error) {
      console.error(error);
    }
  });

  function title(token: Token) {
    switch (token.kind) {
      case Kind.Plus:
        return "Plus";
      case Kind.Minus:
        return "Minus";
      case Kind.Asterisk:
        return "Asterisk";
      case Kind.Slash:
        return "Slash";
      default:
        return "Unknown";
    }
  }
  return (
    <div class="flex flex-wrap items-center gap-x-2 text-sm text-gray-600 dark:text-neutral-400">
      <For each={tokens()}>
        {(token) => {
          return (
            <span
              class="min-w-7.5 min-h-7.5 inline-flex justify-center items-center py-1 px-1.5 bg-gray-200 border border-transparent font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-700 dark:text-neutral-200 cursor-pointer hover:scale-125 transition-[scale]"
              title={title(token)}
            >
              {token.content}
            </span>
          );
        }}
      </For>
    </div>
  );
}
