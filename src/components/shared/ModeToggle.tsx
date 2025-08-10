import { useTheme } from "next-themes";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <ThemeSwitcher
      defaultValue="system"
      onChange={setTheme}
      value={(theme as "light" | "dark" | "system") || "system"}
    />
  );
}
