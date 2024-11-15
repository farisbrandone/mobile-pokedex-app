import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Card } from "../Card";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link } from "expo-router";
import { getPokemonArtWork } from "@/function/pokemon";

type Props = {
  style?: ViewStyle;
  id: number;
  name: string;
};
export function PokemonCard({ style, id, name }: Props) {
  const colors = useThemeColors();
  /* asChild indique que c'est le composant pressable qui recevra le lien 
     sur pressableon a différent event qui sont ecouter dessus
  */
  return (
    <Link href={{ pathname: "/pokemon/[id]", params: { id: id } }} asChild>
      <Pressable
        android_ripple={{ color: colors.tint, foreground: true }}
        style={style}
      >
        <Card style={[styles.card]}>
          <View
            style={[styles.shadow, { backgroundColor: colors.grayBackground }]}
          />
          <ThemedText style={styles.id} variant="caption" color="grayMedium">
            {" "}
            # {id.toString().padStart(3, "0")}{" "}
          </ThemedText>
          <Image
            source={{
              uri: getPokemonArtWork(id),
            }}
            width={90}
            height={90}
          />
          <ThemedText>{name}</ThemedText>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    alignItems: "center",
    padding: 4,
  },
  id: {
    alignSelf: "flex-end",
  },
  shadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    borderRadius: 7,
    flex: 1,
  },
});
