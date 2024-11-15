import { colors } from "@/constants/color";
import { useColorScheme } from "react-native";

export function useThemeColors() {
  const theme = useColorScheme() ?? "light";
  return colors[theme];
}
