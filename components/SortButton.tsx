import { useThemeColors } from "@/hooks/useThemeColors";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Card } from "./Card";
import { Row } from "./Row";
import { Radio } from "./Radio";
import { shadows } from "@/constants/shadows";

type Props = {
  value: "id" | "name";
  onChange: (v: "id" | "name") => void;
};

const options = [
  {
    label: "Number",
    value: "id",
  },
  {
    label: "Name",
    value: "name",
  },
] as const;

/* ? */
export function SortButton({ value, onChange }: Props) {
  const buttonRef = useRef<View>(null);
  const colors = useThemeColors();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [position, setPosition] = useState<null | {
    top: number;
    right: number;
  }>(null);
  const onButtonPress = () => {
    buttonRef.current?.measureInWindow((x, y, width, heigth) => {
      setPosition({
        top: y + heigth,
        right: Dimensions.get("window").width - x - width,
      });
    }); /* mesurer la position de l"élément dans la fenetre */
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Pressable onPress={onButtonPress}>
        <View
          ref={buttonRef}
          style={[styles.button, { backgroundColor: colors.grayWhite }]}
        >
          <Image
            source={
              value === "id"
                ? require("@/assets/images/number.png")
                : require("@/assets/images/alphabet.png")
            }
            width={16}
            height={16}
          />
        </View>
      </Pressable>
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View
            style={[
              styles.popup,
              { backgroundColor: colors.tint, ...position },
            ]}
          >
            <ThemedText style={styles.title}>Sort by :</ThemedText>
            <Card style={styles.card}>
              {options.map((o) => (
                <Pressable key={o.value} onPress={() => onChange(o.value)}>
                  <Row gap={8}>
                    <Radio checked={o.value === value} />

                    <ThemedText>{o.label} </ThemedText>
                  </Row>
                </Pressable>
              ))}
            </Card>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 32,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popup: {
    position: "absolute",
    width: 113,
    padding: 4,
    paddingTop: 16,
    gap: 16,
    borderRadius: 12,
    ...shadows.dp2,
  },
  title: {
    paddingLeft: 20,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
});
