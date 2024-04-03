import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { useLayoutEffect, useState } from "react";

import Icon from "react-native-vector-icons/FontAwesome";
import ShoeIcon from "react-native-vector-icons/MaterialCommunityIcons";

import * as SQLite from "expo-sqlite/next";

const db = SQLite.openDatabaseSync("main");

interface GoalSql {
  GoalId: number;
  ScorerId: number;
  AssistId?: number;
  Description: string | undefined;
  Date: string;
}

interface Goal {
  GoalId: number;
  Scorer: string;
  Assister?: string;
  Description: string | null;
}

import { Score, Scoreboard } from "../../components/Scoreboard";

export default function MatchDetailScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [date, setDate] = useState<string>("");
  const [scores, setScores] = useState<Score[]>([]);
  const [deletion, setDeletion] = useState<boolean>(false);
  const router = useRouter()

  const params = useLocalSearchParams();

  useLayoutEffect(() => {
    const newGoals = getGoals();
    getScores(newGoals);
    console.log(scores);
  }, []);

  const getScores = (goals_) => {
    const newScores: Score[] = [];

    for (let i = 0; i < goals_.length; i++) {
      // Scorer
      const scorer = goals_[i].Scorer;

      const scorerObj = newScores.find((obj) => obj.player == scorer);

      if (scorerObj) {
        scorerObj.goals = scorerObj.goals + 1;
      } else {
        const score: Score = { player: scorer, goals: 1, assists: 0 };
        newScores.push(score);
      }

      const assister = goals_[i].Assister;
      if (assister) {
        const assisterObj = newScores.find((obj) => obj.player == assister);
        if (assisterObj) {
          assisterObj.assists = assisterObj.assists + 1;
        } else {
          const score: Score = { player: assister, goals: 0, assists: 1 };
          newScores.push(score);
        }
      }
    }

    setScores([...newScores]);
  };

  const getGoals = () => {
    const date = getMatchDay();
    const goalsSql: GoalSql[] = db.getAllSync(
      `SELECT * FROM Goals WHERE Date = "${date}";`
    );

    const newGoals: Goal[] = [];
    const names = {};
    for (let i = 0; i < goalsSql.length; i++) {
      var goal: Goal = {
        GoalId: null,
        Assister: "",
        Scorer: "",
        Description: null,
      };

      if (goalsSql[i].Description) {
        goal.Description = goalsSql[i].Description;
      }

      goal.GoalId = goalsSql[i].GoalId;

      const scorerId = goalsSql[i].ScorerId;

      if (scorerId in names) {
        goal.Scorer = names[scorerId];
      } else {
        const scorerName: { Name: string } = db.getFirstSync(
          `SELECT Name FROM Players WHERE PlayerId = ${scorerId};`
        );
        names[scorerId] = scorerName.Name;
        goal.Scorer = scorerName.Name;
      }

      const assisterId = goalsSql[i].AssistId;

      if (assisterId) {
        if (assisterId in names) {
          goal.Assister = names[assisterId];
        } else {
          const assisterName: { Name: string } = db.getFirstSync(
            `SELECT Name FROM Players WHERE PlayerId = ${assisterId};`
          );
          names[assisterId] = assisterName.Name;
          goal.Assister = assisterName.Name;
        }
      } else {
        goal.Assister = null;
      }

      newGoals.push(goal);
    }

    setGoals([...newGoals]);
    return newGoals;
  };

  const getMatchDay = () => {
    const newDate: { Date: string } = db.getFirstSync(
      `SELECT Date FROM Matches WHERE MatchId = ${params.id};`
    );
    setDate(newDate.Date);
    return newDate.Date;
  };

  const deleteMatch = () => {
    db.execSync(
      `DELETE FROM Matches WHERE Date = "${date}"; DELETE FROM Goals WHERE Date = "${date}";`
    );
    router.replace("/")
  };

  return (
    <SafeAreaView>
      <Modal animationType="slide" transparent={true} visible={deletion}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this match?
            </Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Pressable
                style={styles.button}
                onPress={() => setDeletion(!deletion)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteMatch()}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView style={styles.scroll}>
        <View key="titleSection" style={styles.title}>
          <Text>Match from {date}</Text>
          <Pressable
            onPress={() => {
              setDeletion(true);
            }}
          >
            <Icon name="trash" size={20} color={"black"} />
          </Pressable>
        </View>

        {goals.map((item) => (
          <View key={item.GoalId} style={styles.goal}>
            <Text style={styles.players}>
              <Icon name="soccer-ball-o" size={16} color="#0a0" />{" "}
              {item.Scorer[0].toUpperCase() + item.Scorer.slice(1)}
              {"    "}
              {item.Assister ? (
                <>
                  <ShoeIcon name="shoe-cleat" color="#0aa" size={21} />{" "}
                  {item.Assister[0].toUpperCase() + item.Assister.slice(1)}
                </>
              ) : (
                ""
              )}
            </Text>
            {item.Description ? (
              <Text style={styles.description}>
                {item.Description[0].toUpperCase() + item.Description.slice(1)}
              </Text>
            ) : (
              ""
            )}
          </View>
        ))}
        <Text style={{ backgroundColor: "#eee", opacity: 1 / 2 }}></Text>
        {scores ? <Scoreboard scores={scores} /> : ""}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: "#eee" },
  title: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    color: "black",
    padding: 16,
    fontSize: 18,
    borderColor: "#999",
    borderWidth: 1,
  },
  goal: {
    backgroundColor: "white",
    padding: 14,
    paddingVertical: 8,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    gap: 16,
  },
  description: {
    color: "#442",
    fontSize: 15,
  },
  players: {
    fontSize: 17,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    maxHeight: 160,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 8,
    margin: 2,
    marginHorizontal: 14,
    borderRadius: 6,
    elevation: 2,
    backgroundColor: "#44f",
  },
  deleteButton: {
    padding: 8,
    margin: 2,
    marginHorizontal: 14,
    borderRadius: 6,
    elevation: 2,
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
