import { View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps & {
  gap?: number;
};

export function Row({ style, gap, ...rest }: Props) {
  /* ["1"].map() */
  return (
    <View style={[rowStyle, style, gap ? { gap: gap } : undefined]} {...rest}>
      {rest.children}
    </View>
  );
}

const rowStyle = {
  flex: 0 /* prends le minimun de largeur possible */,
  flexDirection: "row",
  alignItems: "center",
} satisfies ViewStyle;
