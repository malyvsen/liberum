import React from "react";
import { Text } from "react-native";

export function MonoText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export function BigMonoText(props) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { fontSize: 20, fontWeight: "bold", fontFamily: "space-mono" }
      ]}
    />
  );
}
