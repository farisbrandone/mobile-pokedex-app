import { colors } from "@/constants/color";
import { View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

type Props = {
  name: keyof (typeof colors)["type"];
};

export function PokemonType({ name }: Props) {
  return (
    <View style={[rootStyle, { backgroundColor: colors.type[name] }]}>
      <ThemedText
        color="grayWhite"
        variant="subtitle3"
        style={{ textTransform: "capitalize" }}
      >
        {name}
      </ThemedText>
    </View>
  );
}

const rootStyle = {
  flex: 0,
  height: 20,
  paddingHorizontal: 8,
  borderRadius: 8,
} satisfies ViewStyle;
