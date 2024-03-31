import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StyleSheet } from "react-native";

import * as SQLite from "expo-sqlite/next";
import { Picker } from "@react-native-picker/picker";
const db = SQLite.openDatabaseSync("main");

interface GoalRecord {
  goal: string;
  assist: string | null;
}

export default function MatchScreen() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState<GoalRecord[]>([
    { goal: "", assist: "" },
  ]);

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = () => {
    const newPlayers = db.getAllSync("SELECT * FROM PLAYERS");
    setPlayers(newPlayers);
  };

  const addGoal = (index: number, name: string) => {
    var newPlayers = selectedPlayers;
    newPlayers[index].goal = name;
    setSelectedPlayers([...newPlayers]);
    console.log(selectedPlayers);
  };

  const addAssist = (index: number, name: string) => {
    var newPlayers = selectedPlayers;
    newPlayers[index].assist = name;
    setSelectedPlayers([...newPlayers]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {selectedPlayers.map((player, idx) => (
          <View key={idx} style={styles.goal}>
            <View style={styles.goalElement}>
              <Text style={styles.label}>Goal:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedPlayers[idx].goal}
                onValueChange={(val, unusedIndex) => addGoal(idx, val)}
                itemStyle={styles.pickerItem}
              >
                {players.map((p) => (
                  <Picker.Item key={p.name} label={p.Name} value={p.Name} />
                ))}
              </Picker>
            </View>
            <View style={styles.goalElement}>
              <Text style={styles.label}>Assist:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedPlayers[idx].assist}
                onValueChange={(val, unusedIndex) => addAssist(idx, val)}
                itemStyle={styles.pickerItem}
              >
                {players.map((p) => (
                  <Picker.Item key={p.name} label={p.Name} value={p.Name} />
                ))}
              </Picker>
            </View>

            <TextInput multiline={true} style={styles.text} />
          </View>
        ))}

        <Button
          onPress={() => {
            setSelectedPlayers([...selectedPlayers, { goal: "", assist: "" }]);
          }}
          color={"orange"}
          title="New goal"
        ></Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe",
    justifyContent: "flex-start",
    gap: 10,
    padding: 15,
  },
  goal: {
    backgroundColor: "white",
    padding: 14,
    borderColor: "#eee",
    borderRadius: 10,
    borderWidth: 2,
    margin: 5,
  },
  text: {
    height: 80,
    overflow: "hidden",
    fontSize: 18,
    backgroundColor: "white",
    width: 300,
    padding: 10,
    borderWidth: 1,
    marginBottom: 40,
    textAlignVertical: "top",
    borderColor: "#eee",
  },
  label: {
    fontSize: 20,
  },
  goalElement: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  picker: {
    flex: 0.5,
    paddingHorizontal: 30,
    borderWidth: 2,
    color: "gray",
  },
  pickerItem: {},
});
