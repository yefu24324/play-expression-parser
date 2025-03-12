import { Bars3CenterLeftIcon, XMarkIcon } from "@feiling/icons/outline";
import { useSidebar } from "~/plugins/base/context/sidebar-context";

export function BaseLayoutExpand() {
  const sidebarContext = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      sidebarContext.toggleSidebar();
    } else {
      sidebarContext.toggleMobileSidebar();
    }
  };
  return (
    <button
      type="button"
      class="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
      onClick={handleToggle}
      aria-label="Toggle Sidebar"
    >
      {sidebarContext.isMobileOpen ? <XMarkIcon /> : <Bars3CenterLeftIcon />}
      {/* Cross Icon */}
    </button>
  );
}
