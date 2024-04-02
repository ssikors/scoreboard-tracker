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
import { Player } from "./statistics";
const db = SQLite.openDatabaseSync("main");

interface GoalRecord {
  goal: string;
  assist: string | null;
  description: string;
}

export default function MatchScreen() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState<GoalRecord[]>([
    { goal: "", assist: "", description: "" },
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

  const addDescription = (index: number, desc: string) => {
    var newPlayers = selectedPlayers;
    newPlayers[index].description = desc;
    setSelectedPlayers([...newPlayers]);
  };

  const saveMatch = () => {
    var date = new Date().toISOString().slice(0, 10);

    console.log(date);
    for (let i = 0; i < selectedPlayers.length; i++) {
      var scorer = selectedPlayers[i].goal;
      var scorerObj: { PlayerId: number } | null = db.getFirstSync(
        `SELECT PlayerId FROM Players WHERE Name = "${scorer}";`
      );
      var scorerId = scorerObj.PlayerId;
      var description = selectedPlayers[i].description;

      console.log(i);
      console.log(selectedPlayers);
      var assister = selectedPlayers[i].assist;
      if (assister != "") {
        var assisterObj: { PlayerId: number } | null = db.getFirstSync(
          `SELECT PlayerId FROM Players WHERE Name = "${assister}";`
        );
        var asisterId = assisterObj.PlayerId;

        console.log(asisterId);
        db.execSync(
          `INSERT INTO Goals (ScorerId, AssistId, Description) VALUES(${scorerId}, ${asisterId}, "${description}");`
        );
      } else {
        db.execSync(
          `INSERT INTO Goals (ScorerId, Description) VALUES(${scorerId}, "${description}");`
        );
      }
      db.execSync(`INSERT INTO Matches (Date) VALUES("${date}");`);

      var goals = db.getAllSync("SELECT * FROM Goals;");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {selectedPlayers.map((player, idx) => (
          <View key={idx} style={styles.goal}>
            <View key={idx + " 1"} style={styles.goalElement}>
              <Text style={styles.label}>Goal:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedPlayers[idx].goal}
                onValueChange={(val, unusedIndex) => addGoal(idx, val)}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item key="" label="" value={""} />
                {players.map((p) => (
                  <Picker.Item key={p.name} label={p.Name} value={p.Name} />
                ))}
              </Picker>
            </View>
            <View key={idx + " 2"} style={styles.goalElement}>
              <Text style={styles.label}>Assist:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedPlayers[idx].assist}
                onValueChange={(val, unusedIndex) => addAssist(idx, val)}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item key="" label="" value={""} />
                {players.map((p) => (
                  <Picker.Item key={p.name} label={p.Name} value={p.Name} />
                ))}
              </Picker>
            </View>

            <TextInput
              onChangeText={(val) => addDescription(idx, val)}
              multiline={true}
              style={styles.text}
            />
          </View>
        ))}
        <View key={"new"} style={styles.button}>
          <Button
            onPress={() => {
              setSelectedPlayers([
                ...selectedPlayers,
                { goal: "", assist: "", description: "" },
              ]);
            }}
            color={"orange"}
            title="New goal"
          ></Button>
        </View>

        <View key={"Save"} style={styles.button}>
          <Button
            onPress={() => {
              saveMatch();
            }}
            color={"green"}
            title="Save match"
          ></Button>
        </View>
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
  button: { margin: 10 },
});
