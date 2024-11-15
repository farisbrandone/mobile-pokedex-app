import { shadows } from "@/constants/shadows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps;

export function Card({ style, ...rest }: Props) {
  const colors = useThemeColors();
  return (
    <View
      style={[styles, { backgroundColor: colors.grayWhite }, style]}
      {...rest}
    ></View>
  );
}

const styles = {
  borderRadius: 8,
  overflow: "hidden",
  ...shadows.dp2,
} satisfies ViewStyle;
