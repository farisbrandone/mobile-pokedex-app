import { Image, StyleSheet, TextInput, View } from "react-native";
import { Row } from "./Row";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = {
  value: string;
  onChange: (s: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const colors = useThemeColors();
  return (
    <Row
      gap={8}
      style={[styles.wrapper, { backgroundColor: colors.grayWhite }]}
    >
      <Image
        source={require("@/assets/images/Search.png")}
        width={16}
        height={16}
      />
      <TextInput
        style={[styles.input, { color: colors.grayDark }]}
        onChangeText={onChange}
        value={value}
      ></TextInput>
    </Row>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 16,
    height: 40,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    lineHeight: 40,
  },
});
