import { ViewStyle } from "react-native";

export const shadows = {
  dp2: {
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 } /* sur x=0 et y= descend un peu*/,
    shadowRadius: 3,
    elevation: 2 /**ddans lecas de android */,
  },
} satisfies Record<string, ViewStyle>;
