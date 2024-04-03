import { useLocalSearchParams } from "expo-router";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
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

export default function MatchDetailScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [date, setDate] = useState<string>("");

  useLayoutEffect(() => {
    getGoals();
  }, []);

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
    console.log(newGoals);
  };

  const getMatchDay = () => {
    const newDate: { Date: string } = db.getFirstSync(
      `SELECT Date FROM Matches WHERE MatchId = ${params.id};`
    );
    setDate(newDate.Date);
    return newDate.Date;
  };

  const params = useLocalSearchParams();

  return (
    <SafeAreaView>
      <ScrollView style={styles.scroll}>
        <Text key="titleSection" style={styles.title}>
          Match from {date}
        </Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: "white" },
  title: { backgroundColor: "#999", color: "white", padding: 16, fontSize: 18 },
  goal: {
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
});
