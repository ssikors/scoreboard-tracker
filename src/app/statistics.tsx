import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import * as SQLite from "expo-sqlite/next";
import { GoalSql } from "./match/[id]";
import { Scoreboard } from "../components/Scoreboard";

const db = SQLite.openDatabaseSync("main");

interface Player {
  playerId: number;
  player: string;
  goals: DataPoint[];
  assists: DataPoint[];
}

interface PlayersStats {
  players: Player[];
}

interface DataPoint {
  x: Date;
  y: number;
}

interface PlayerSql {
  PlayerId: number;
  Name: string;
}

interface MatchSql {
  MatchId: number;
  Date: string;
}

export default function StatisticsScreen() {
  const [playerStats, setPlayerStats] = useState<PlayersStats>();
  const [colors, setColors] = useState([]);
  const [maxGoals, setMaxGoals] = useState(null);
  const [maxAssists, setMaxAssists] = useState(null);

  const populateColors = (players) => {
    const playerCount = players.players.length;
    const quant = 255 / playerCount;

    const newColors = [];
    for (let i = 0; i < playerCount; i++) {
      const r = quant * i;
      const b = 255 - quant * i;

      const color = `rgba(${r}, ${Math.random() * 225}, ${b}, ${
        Math.random() / 3 + 0.5
      })`;
      newColors.push(color);
    }
    setColors([...newColors]);
  };

  useFocusEffect(
    useCallback(() => {
      getPlayerStats();
    }, [])
  );

  useEffect(() => {
    getPlayerStats();
  }, []);

  const getPlayerStats = () => {
    const sqlPlayers: PlayerSql[] = db.getAllSync("SELECT * FROM Players;");
    var maxG = 0;
    var maxA = 0;

    const newPlayers: PlayersStats = { players: [] };

    for (let i = 0; i < sqlPlayers.length; i++) {
      const name = sqlPlayers[i].Name;
      const id = sqlPlayers[i].PlayerId;
      const player: Player = {
        playerId: id,
        player: name,
        goals: [],
        assists: [],
      };
      newPlayers.players.push(player);
    }

    const matches: MatchSql[] = db.getAllSync("SELECT * FROM Matches;");

    for (let i = 0; i < matches.length; i++) {
      const date = matches[i].Date;
      const dateObject = new Date(date);

      for (let i = 0; i < newPlayers.players.length; i++) {
        const player = newPlayers.players[i];
        if (player.goals.length == 0) {
          player.goals.push({ x: dateObject, y: 0 });
          player.assists.push({ x: dateObject, y: 0 });
        } else {
          player.goals.push({
            x: dateObject,
            y: player.goals[player.goals.length - 1].y,
          });
          player.assists.push({
            x: dateObject,
            y: player.assists[player.assists.length - 1].y,
          });
        }
      }

      const daysGoals: GoalSql[] = db.getAllSync(
        `SELECT * FROM Goals WHERE Date = "${date}";`
      );

      for (let i = 0; i < daysGoals.length; i++) {
        const scorerId = daysGoals[i].ScorerId;
        const assisterId = daysGoals[i].AssistId;

        const scorer = newPlayers.players.find((p) => p.playerId == scorerId);

        const goalDataPoint = scorer.goals.find((g) => g.x == dateObject);

        goalDataPoint.y = goalDataPoint.y + 1;

        maxG = Math.max(maxG, goalDataPoint.y);

        if (assisterId) {
          const assister = newPlayers.players.find(
            (p) => p.playerId == assisterId
          );
          const assistDataPoint = assister.assists.find(
            (a) => a.x == dateObject
          );
          assistDataPoint.y = assistDataPoint.y + 1;
          maxA = Math.max(maxA, assistDataPoint.y);
        }
      }
    }
    setMaxAssists(maxA);
    setMaxGoals(maxG);
    populateColors(newPlayers);
    setPlayerStats(newPlayers);
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Goals</Text>
        <VictoryChart
          key={"Goals chart"}
          theme={VictoryTheme.material}
          height={280}
        >
          <VictoryAxis
            key={"X"}
            tickFormat={(tick) => {
              const date = new Date(tick);
              var string = "";
              string =
                string +
                date.getDate() +
                "/" +
                date.getMonth() +
                "/'" +
                date.getFullYear().toString().slice(2, 4);
              return string;
            }}
          />
          <VictoryAxis
            key={"Y"}
            tickFormat={(tick) => Math.round(tick)}
            tickValues={Array.from(
              { length: maxGoals + 2 },
              (value, index) => index
            )}
            dependentAxis
          />
          {playerStats
            ? playerStats.players.map((item, index) => {
                if (item.goals[item.goals.length - 1].y == 0) {
                  return "";
                } else {
                  return (
                    <VictoryLine
                      key={index}
                      style={{
                        data: { stroke: colors[index] },
                        parent: { border: "1px solid #ccc" },
                      }}
                      data={[...item.goals]}
                    />
                  );
                }
              })
            : ""}
        </VictoryChart>
        <Text style={styles.title}>Assists</Text>
        <VictoryChart
          key={"Assists chart"}
          theme={VictoryTheme.material}
          height={280}

        >
          <VictoryAxis
            key={"X"}
            tickFormat={(tick) => {
              const date = new Date(tick);
              var string = "";
              string =
                string +
                date.getDate() +
                "/" +
                date.getMonth() +
                "/'" +
                date.getFullYear().toString().slice(2, 4);
              return string;
            }}
          />
          <VictoryAxis
            key={"Y"}
            tickFormat={(tick) => Math.round(tick)}
            tickValues={Array.from(
              { length: maxAssists + 2 },
              (value, index) => index
            )}
            dependentAxis
          />
          {playerStats
            ? playerStats.players.map((item, index) => {
                if (item.assists[item.assists.length - 1].y == 0) {
                  return "";
                } else {
                  return (
                    <VictoryLine
                      key={index}
                      style={{
                        data: { stroke: colors[index] },
                        parent: { border: "1px solid #ccc" },
                      }}
                      data={[...item.assists]}
                    />
                  );
                }
              })
            : ""}
        </VictoryChart>
        {playerStats ? (
          <View style={styles.legend}>
            <VictoryLegend
            borderPadding={10}
              x={40}
              y={0}
              orientation="vertical"
              gutter={18}
              itemsPerRow={2}
              style={{ border: { stroke: "black" } }}
              colorScale={colors}
              data={playerStats.players.map((item) => {
                const obj = { name: item.player };
                return obj;
              })}
            />
          </View>
        ) : (
          ""
        )}
        {playerStats ? (
          <Scoreboard
            scores={playerStats.players
              .map((item) => {
                const obj = {
                  player: item.player,
                  assists: item.assists[item.assists.length - 1].y,
                  goals: item.goals[item.goals.length - 1].y,
                };
                return obj;
              })
              .sort((a, b) => {
                if (a.goals - b.goals != 0) {
                  return a.goals - b.goals;
                } else {
                  return b.assists - a.assists;
                }
              })}
          ></Scoreboard>
        ) : (
          ""
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  legend: {
    marginBottom: -150
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 8,
    marginBottom: -16
  }
});
