import { ArrowUturnLeftIcon } from "@feiling/icons/outline";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { NavigationMenu } from "~/components/navigation-menu/navigation-menu";
import { NavigationMenuItem } from "~/components/navigation-menu/navigation-menu-item";
import { NavigationMenuSub } from "~/components/navigation-menu/navigation-menu-sub";
import { useSidebar } from "~/plugins/base/context/sidebar-context";

export interface BaseLayoutSidebarProps {
  class?: string;
  children?: JSX.Element;
}

export const sidebarVariants = cva(
  "fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 lg:translate-x-0",
  {
    variants: {
      size: {
        default: "w-[290px]",
        compact: "w-[90px]",
      },
      mobileOpen: {
        true: "translate-x-0",
        false: "-translate-x-full",
      },
    },
  },
);

export function BaseLayoutSidebar(props: BaseLayoutSidebarProps) {
  const sidebarContext = useSidebar();
  function isCompact(): boolean {
    return !(sidebarContext.isExpanded || sidebarContext.isMobileOpen) && !sidebarContext.isHovered;
  }
  return (
    <aside
      class={twMerge(
        clsx(
          sidebarVariants({
            size: isCompact() ? "compact" : "default",
            mobileOpen: sidebarContext.isMobileOpen,
          }),
        ),
      )}
    >
      {props.children}
    </aside>
  );
}
