import { Button, Dropdown, Menu, MenuItem } from "@feiling/components";
import { Cog6ToothIcon, MoonIcon, SunIcon } from "@feiling/icons/outline";
import { createSignal } from "solid-js";
import { useThemeContext } from "../context/theme-context";

export function ThemeDropdown() {
  const [anchorEl, setAnchorEl] = createSignal<HTMLElement>();
  const themeContext = useThemeContext();
  return (
    <div>
      <Dropdown anchorEl={anchorEl}>
        <Menu>
          <MenuItem onClick={() => themeContext.setTheme("dark")}>
            <SunIcon />
            亮色
          </MenuItem>
          <MenuItem onClick={() => themeContext.setTheme("light")}>
            <MoonIcon />
            暗色
          </MenuItem>
          {/*<MenuItem>*/}
          {/*  <Cog6ToothIcon />*/}
          {/*  跟随系统*/}
          {/*</MenuItem>*/}
        </Menu>
      </Dropdown>
      <Button class="h-8 w-8" ref={setAnchorEl} variant="soft" color="secondary">
        {themeContext.theme() === "light" ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  );
}
