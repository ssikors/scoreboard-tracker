import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { StyleSheet } from "react-native";

import * as SQLite from "expo-sqlite/next";
import { useRouter } from "expo-router";

const db = SQLite.openDatabaseSync("main");

export default function AddPlayerScreen() {
  const [name, setName] = useState<string>("");
  const router = useRouter()

  const createUser = () => {
    db.execSync(`INSERT INTO Players ( Name ) VALUES ( '${name}' );`)
    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Player name:</Text>
      <TextInput
        style={styles.name}
        placeholder="Player name"
        onChangeText={(newText) => setName(newText)}
        defaultValue={name}
      />
      <Button color={"orange"} title={`Add player ${name}`} onPress={createUser} ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe",
    justifyContent: "flex-start",
    paddingTop: 60,
    alignItems: "center",
    gap: 10,
    
  },
  name: {
    height: 40,
    fontSize: 18,
    backgroundColor: "white",
    width: 300,
    textAlign: "center",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 40
  },
  label: {
    fontSize: 20
  }
});
