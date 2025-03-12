import type { RouteSectionProps } from "@solidjs/router";
import { createSignal } from "solid-js";
import { ExpressionAstTree } from "~/components/expression-viewer/expression-ast-tree";
import { ExpressionTokensViewer } from "~/components/expression-viewer/expression-tokens-viewer";
import { ThemeToggle } from "~/plugins/base/layout/theme-toggle";

// 表达式示例
const examples: string[] = ["10 * (1 + 2) + 2 * 3", "SUM(1, 2, 3)", "{price} * {count}", `CONCAT("Hello", "World")`];

export default function Home(props: RouteSectionProps) {
  const [content, setContent] = createSignal<string>(examples[0]);

  function handleExampleClick(example: number) {
    setContent(examples[example]);
  }
  return (
    <div class="flex flex-col min-h-screen px-4 md:px-8">
      <nav class="min-h-10 pt-4 pb-12 relative sm:min-h-14 sm:pb-24 md:pt-8">
        <div class="w-full max-w-3xl mx-auto relative" />
        <div class="absolute right-0 top-4 z-10 md:top-8">
          <ThemeToggle />
        </div>
      </nav>
      <div class="grow w-full max-w-3xl mx-auto flex flex-col gap-y-4">
        <div class="flex align-middle items-center gap-x-0.5 p-2">
          <span class="dark:text-neutral-200">Examples:</span>
          <button
            type="button"
            class="ql-bold size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 cursor-pointer"
            onClick={() => handleExampleClick(0)}
          >
            1
          </button>
          <button
            type="button"
            class="ql-bold size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 cursor-pointer"
            onClick={() => handleExampleClick(1)}
          >
            2
          </button>
          <button
            type="button"
            class="ql-bold size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 cursor-pointer"
            onClick={() => handleExampleClick(2)}
          >
            2
          </button>
          <button
            type="button"
            class="ql-bold size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 cursor-pointer"
            onClick={() => handleExampleClick(3)}
          >
            2
          </button>
        </div>
        <input
          class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          value={content()}
          onInput={(event) => setContent(event.target.value)}
        />
        <ExpressionTokensViewer content={content()} />
        <ExpressionAstTree content={content()} />
      </div>
    </div>
  );
}
