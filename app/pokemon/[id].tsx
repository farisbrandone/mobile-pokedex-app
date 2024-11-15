import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors as Colors } from "@/constants/color";
import {
  formatSize,
  formatWeight,
  getPokemonArtWork,
} from "@/function/pokemon";
import { Card } from "@/components/Card";
import { PokemonType } from "@/components/PokemonType";
import { PokemonSpec } from "@/components/PokemonSpec";
import { PokemonStat } from "@/components/PokeomonStat";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { Audio } from "expo-av";
import PagerView from "react-native-pager-view";
import { useRef, useState } from "react";

export default function Pokemon() {
  const params = useLocalSearchParams() as { id: string };
  const [id, setId] = useState(parseInt(params.id, 10));
  const offset = useRef(1);
  const pager = useRef<PagerView>(null);
  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    offset.current = e.nativeEvent.position - 1;
  };

  const onPageScrollStateChanged = (e: {
    nativeEvent: { pageScrollState: string };
  }) => {
    if (e.nativeEvent.pageScrollState !== "idle") {
      /**dans le cas ou on est sur le premier on ne peu plus continuer à gauche */
      return;
    }
    if (offset.current === -1 && id === 2) {
      /**tu etait sur le pokemon numéro3
       * tu reviens en arrière une fois
       * ensuite une fois
       * ensute encore on ne peuplus aller à gauche sur ce cas offset.current=-1
       */
      return;
    }
    if (offset.current === 1 && id === 150) {
      /**tu etait sur le pokemon numéro3
       * tu reviens en arrière une fois
       * ensuite une fois
       * ensute encore on ne peuplus aller à gauche sur ce cas offset.current=-1
       */
      return;
    }

    if (offset.current !== 0) {
      /**l'utilisateur n'est plus entrain de dreguer, droper */
      /**offset current à changer on n'est plus sur la page 0*/

      setId(id + offset.current);
      offset.current = 0;
      pager.current?.setPageWithoutAnimation(1);
    }
  };
  const onPrevious = () => {
    pager.current?.setPage(0);
    /*  router.replace({
      pathname: "/pokemon/[id]",
      params: { id: Math.max(id - 1, 1) },
    }); */
  };

  const onNext = () => {
    pager.current?.setPage(2 + offset.current);
    /*  router.replace({
      pathname: "/pokemon/[id]",
      params: { id: Math.max(id + 1, 151) },
    }); */
  };
  return (
    <PagerView
      ref={pager}
      initialPage={1}
      style={{ flex: 1 }}
      onPageSelected={onPageSelected}
      onPageScrollStateChanged={onPageScrollStateChanged}
    >
      <PokemonView
        key={id - 1}
        id={id - 1}
        onNext={onNext}
        onPrevious={onPrevious}
      />
      <PokemonView key={id} id={id} onNext={onNext} onPrevious={onPrevious} />
      <PokemonView
        key={id + 1}
        id={id + 1}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </PagerView>
  );
}

type Props = {
  id: number;
  onNext: () => void;
  onPrevious: () => void;
};

function PokemonView({ id, onPrevious, onNext }: Props) {
  //const params = useLocalSearchParams() as { id: string };
  const colors = useThemeColors();
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: id });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: id,
  });
  const mainType = pokemon?.types?.[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === "en")
    ?.flacor_text?.replaceAll("\n", ".");

  const top = useSharedValue(0);
  //const id = parseInt(id);
  const onImagePress = async () => {
    const cry = pokemon?.cries.latest;
    if (!cry) {
      return;
    }
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: cry,
      },
      { shouldPlay: true }
    );
    sound.playAsync();
  };

  const isFirst = id === 1;
  const isLast = id === 151;

  return (
    <RootView backgroundColor={colorType}>
      <View>
        <Image style={styles.pokeball} />
        <Row style={styles.header}>
          <Pressable onPress={router.back}>
            <Row gap={8}>
              <Image
                source={require("@/assets/images/back.png")}
                width={32}
                height={32}
              />
              <ThemedText color="grayWhite" variant="headline">
                {pokemon?.name}
              </ThemedText>
            </Row>
          </Pressable>
          <Pressable onPress={() => (top.value = withSpring(50))}>
            <ThemedText color="grayWhite" variant="subtitle2">
              #{id.toString().padStart(3, "0")}
            </ThemedText>
          </Pressable>
        </Row>
        {/* <View style={styles.body}> */}
        <Card style={[styles.card, { overflow: "visible" }]}>
          <Row style={styles.imageRow}>
            {isFirst ? (
              <View style={{ width: 24, height: 24 }}></View>
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  source={require("@/assets/images/flecheprevious.png")}
                  width={24}
                  height={24}
                />
              </Pressable>
            )}
            <Pressable onPress={onImagePress}>
              <Animated.Image
                style={{ ...styles.artWork, top: top }}
                source={{ uri: getPokemonArtWork(id) }}
                width={200}
                height={200}
              />
            </Pressable>
            {isLast ? (
              <View style={{ width: 24, height: 24 }}></View>
            ) : (
              <Pressable onPress={onNext}>
                <Image
                  source={require("@/assets/images/flechenext.png")}
                  width={24}
                  height={24}
                />
              </Pressable>
            )}
          </Row>
          <Row gap={16} style={{ height: 20 }}>
            {types.map((type) => (
              <PokemonType name={type.type.name} key={type.type.name} />
            ))}
          </Row>
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            About
          </ThemedText>

          <Row>
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formatWeight(pokemon?.weight)}
              description="Weight"
              image={require("@/assets/images/weight.png")}
            />
            <PokemonSpec
              title={formatSize(pokemon?.height)}
              description="height"
              image={require("@/assets/images/regle.png")}
            />
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={pokemon?.moves
                .slice(0, 2)
                .map((m) => m.move.name)
                ?.join("\n")}
              description="Moves"
              image={require("@/assets/images/regle.png")}
            />
          </Row>
          <ThemedText> {bio} </ThemedText>
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            Base stats
          </ThemedText>
          <View style={{ alignSelf: "stretch" }}>
            {pokemon?.stats.map((stat) => (
              <PokemonStat
                name={stat.stat.name}
                key={stat.stat.name}
                value={stat.base_stat}
                color={colorType}
              />
            ))}
          </View>
        </Card>
        {/* </View> */}
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  pokeball: {
    opacity: 0.1,
    position: "absolute",
    right: 8,
    top: 8,
  },
  imageRow: {
    position: "absolute",
    top: -140,
    zIndex: 2,
    justifyContent: "space-between",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  artWork: {},
  body: {},
  card: {
    marginTop: 44,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 16,
    alignItems: "center",
  },
});
