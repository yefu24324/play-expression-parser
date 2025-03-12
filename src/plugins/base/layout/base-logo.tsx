import { Show } from "solid-js";
import logoDark from "~/assets/logo/logo-dark.svg";
import logo from "~/assets/logo/logo.svg";
import { useSidebar } from "~/plugins/base/context/sidebar-context";

export interface BaseLogoProps {
  class?: string;
  href: string;
  logo: string;
  darkLogo: string;
  logoIcon: string;
}

export function BaseLogo(props: BaseLogoProps) {
  const sidebarContext = useSidebar();

  return (
    <a href="/">
      <Show
        when={sidebarContext.isExpanded || sidebarContext.isHovered || sidebarContext.isMobileOpen}
        fallback={<img src={props.logoIcon} alt="Logo" width="32" height="32" />}
      >
        <img
          alt="Logo"
          loading="lazy"
          width="150"
          height="40"
          decoding="async"
          src={logo}
          class="dark:hidden text-transparent"
        />
        <img
          alt="Logo"
          loading="lazy"
          width="150"
          height="40"
          decoding="async"
          class="hidden dark:block text-transparent"
          src={logoDark}
        />
      </Show>
    </a>
  );
}
