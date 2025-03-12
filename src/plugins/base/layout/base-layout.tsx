import type { JSX } from "solid-js";
import { useSidebar } from "~/plugins/base/context/sidebar-context";

export function BaseLayout(props: { children: JSX.Element }) {
  return <div class="min-h-screen" />;
}
