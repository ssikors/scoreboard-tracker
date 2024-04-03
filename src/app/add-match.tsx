import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import { StyleSheet } from "react-native";

import * as SQLite from "expo-sqlite/next";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

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

  const router = useRouter()
  
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

    for (let i = 0; i < selectedPlayers.length; i++) {
      if (selectedPlayers[i].goal == "") {
        continue;
      }

      var scorer = selectedPlayers[i].goal;
      var scorerObj: { PlayerId: number } | null = db.getFirstSync(
        `SELECT PlayerId FROM Players WHERE Name = "${scorer}";`
      );
      var scorerId = scorerObj.PlayerId;
      var description = selectedPlayers[i].description;

      var assister = selectedPlayers[i].assist;
      if (assister != "") {
        var assisterObj: { PlayerId: number } | null = db.getFirstSync(
          `SELECT PlayerId FROM Players WHERE Name = "${assister}";`
        );
        var asisterId = assisterObj.PlayerId;

        db.execSync(
          `INSERT INTO Goals (ScorerId, AssistId, Description, Date) VALUES(${scorerId}, ${asisterId}, "${description}", "${date}");`
        );
      } else {
        db.execSync(
          `INSERT INTO Goals (ScorerId, Description, Date) VALUES(${scorerId}, "${description}", "${date}");`
        );
      }
    }
    try {
      db.execSync(`INSERT INTO Matches (Date) VALUES("${date}");`);
    } catch (error) {
      console.log("Added to existing match");
    }

    router.replace("/")
  };

  const deleteRecord = (idx: number) => {
    const newSelected = selectedPlayers;
    newSelected.splice(idx, 1);
    setSelectedPlayers([...newSelected]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView key={"scrollview"}>
        {selectedPlayers.map((player, idx) => (
          <View key={idx} style={styles.goal}>
            <View style={{alignItems: "flex-end"}}>
              <Pressable
                onPress={() => {
                  deleteRecord(idx);
                }}
                style={styles.delete}
              >
                <Icon name="close" size={30} color="#c40001"></Icon>
              </Pressable>
            </View>

            <View key={idx + " 1"} style={styles.goalElement}>
              <Text key={"goal"} style={styles.label}>
                Goal:
              </Text>
              <Picker
                key={"goalP"}
                style={styles.picker}
                selectedValue={selectedPlayers[idx].goal}
                onValueChange={(val, unusedIndex) => addGoal(idx, val)}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item key="none" label="None" value={""} />
                {players.map((p) => (
                  <Picker.Item key={p.name} label={p.Name} value={p.Name} />
                ))}
              </Picker>
            </View>
            <View key={idx + " 2"} style={styles.goalElement}>
              <Text key={"assists"} style={styles.label}>
                Assist:
              </Text>
              <Picker
                key={"assistsP"}
                style={styles.picker}
                selectedValue={selectedPlayers[idx].assist}
                onValueChange={(val, unusedIndex) => addAssist(idx, val)}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item key="none" label="None" value={""} />
                {players.map((p) => (
                  <Picker.Item key={p.name} label={p.Name} value={p.Name} />
                ))}
              </Picker>
            </View>

            <TextInput
              key={"text"}
              onChangeText={(val) => addDescription(idx, val)}
              multiline={true}
              style={styles.text}
            />
          </View>
        ))}
        <View style={styles.span}>
          <Pressable
            onPress={() => {
              setSelectedPlayers([
                ...selectedPlayers,
                { goal: "", assist: "", description: "" },
              ]);
            }}
            style={styles.button}
          >
            <Icon name="plus-circle" size={48} color="orange"></Icon>
          </Pressable>
        </View>

        <View key={"Save"} style={styles.saveSpan}>
          <Button
            key={"saveButton"}
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
    backgroundColor: "#f9f9f9",
    justifyContent: "flex-start",
    gap: 10,
    padding: 15,
  },
  goal: {
    backgroundColor: "white",
    padding: 14,
    paddingBottom: 0,
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
    marginBottom: 8,
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
  button: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  span: {
    alignItems: "center",
    margin: 10
  },
  delete: {
    alignItems: "flex-end",
    marginVertical: -12,
    marginHorizontal: -6,
  },
  saveSpan: {
    alignItems: "center",
    marginTop: 60
  }
});
