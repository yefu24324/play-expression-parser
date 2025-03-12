import { useSidebar } from "~/plugins/base/context/sidebar-context";

export function Backdrop() {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return <div class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden" onClick={toggleMobileSidebar} />;
}
