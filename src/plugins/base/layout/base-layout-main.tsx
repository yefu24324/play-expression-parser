import type { JSX } from "solid-js";
import { useSidebar } from "~/plugins/base/context/sidebar-context";

export function BaseLayoutMain(props: { children: JSX.Element }) {
  const sidebarContext = useSidebar();
  return (
    <div
      class={`flex-1 transition-all duration-300 ease-in-out ${
        sidebarContext.isExpanded || sidebarContext.isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
      } ${sidebarContext.isMobileOpen ? "ml-0" : ""}`}
    >
      {props.children}
      {/*<AppHeader />*/}
      {/*<div class="p-4 mx-auto max-w-screen-2xl md:p-6">{props.children}</div>*/}
    </div>
  );
}
