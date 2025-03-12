"use client";

import { createEventListener } from "@solid-primitives/event-listener";
import { type JSX, createContext, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  /** 侧边栏展开/收起 */
  toggleSidebar: () => void;
  /** 移动端侧边栏展开/收起 */
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export function SidebarProvider(props: { children: JSX.Element }) {
  const [sidebarContext, setSidebarContext] = createStore<SidebarContextType>({
    isExpanded: true,
    isMobileOpen: false,
    isHovered: false,
    activeItem: null,
    openSubmenu: null,
    toggleSidebar() {
      setSidebarContext("isExpanded", (prev) => !prev);
    },
    toggleMobileSidebar() {
      setSidebarContext("isMobileOpen", (prev) => !prev);
    },
    setIsHovered: () => {},
    setActiveItem: () => {},
    toggleSubmenu: () => {},
  });
  const [isMobile, setIsMobile] = createSignal(false);

  function handleResize() {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) {
      setSidebarContext("isMobileOpen", false);
    }
  }

  createEventListener(window, "resize", handleResize);

  handleResize();

  return <SidebarContext.Provider value={sidebarContext}>{props.children}</SidebarContext.Provider>;
}

// export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [activeItem, setActiveItem] = useState<string | null>(null);
//   const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
//
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (!mobile) {
//         setIsMobileOpen(false);
//       }
//     };
//
//     handleResize();
//     window.addEventListener("resize", handleResize);
//
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);
//
//   const toggleSidebar = () => {
//     setIsExpanded((prev) => !prev);
//   };
//
//   const toggleMobileSidebar = () => {
//     setIsMobileOpen((prev) => !prev);
//   };
//
//   const toggleSubmenu = (item: string) => {
//     setOpenSubmenu((prev) => (prev === item ? null : item));
//   };
//
//   return (
//     <SidebarContext.Provider
//       value={{
//         isExpanded: isMobile ? false : isExpanded,
//         isMobileOpen,
//         isHovered,
//         activeItem,
//         openSubmenu,
//         toggleSidebar,
//         toggleMobileSidebar,
//         setIsHovered,
//         setActiveItem,
//         toggleSubmenu,
//       }}
//     >
//       {children}
//     </SidebarContext.Provider>
//   );
// };
