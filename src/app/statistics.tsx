import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import * as SQLite from "expo-sqlite/next";
import { GoalSql } from "./match/[id]";

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
        player.goals.push({ x: dateObject, y: 0 });
        player.assists.push({ x: dateObject, y: 0 });
      }

      const daysGoals: GoalSql[] = db.getAllSync(
        `SELECT * FROM Goals WHERE Date = "${date}";`
      );

      for (let i = 0; i < daysGoals.length; i++) {
        const scorerId = daysGoals[i].ScorerId;
        const assisterId = daysGoals[i].AssistId;

        const scorer = newPlayers.players.find((p) => p.playerId == scorerId);
        console.log("Scorer:", scorer);
        const goalDataPoint = scorer.goals.find((g) => g.x == dateObject);
        console.log(goalDataPoint);
        goalDataPoint.y = goalDataPoint.y + 1;

        if (assisterId) {
          const assister = newPlayers.players.find(
            (p) => p.playerId == assisterId
          );
          const assistDataPoint = assister.assists.find(
            (a) => a.x == dateObject
          );
          assistDataPoint.y = assistDataPoint.y + 1;
        }
      }
    }
    console.log(newPlayers.players[0].assists);
    setPlayerStats(newPlayers);
  };

  return (
    <View>
      <VictoryChart theme={VictoryTheme.material} height={300}>
        <VictoryAxis
          tickFormat={(tick) => {
            const date = new Date(tick);
            var string = "";
            string = string + date.getDate() + "/" + date.getMonth() + "/'" + date.getFullYear().toString().slice(2,4)
            return string
          }}
        />
        <VictoryAxis tickFormat={(tick) => Math.round(tick)} dependentAxis />
        {playerStats ? (
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              ...playerStats.players[1].goals,
              { x: new Date("2024-04-08"), y: 3 },
              { x: new Date("2024-04-09"), y: 5 },
            ]}
          />
        ) : (
          ""
        )}

        {/* <VictoryLine
          style={{
            data: { stroke: "#caaa31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={[
            { x: new Date("2022-03-25"), y: 2 },
            { x: new Date("2022-03-26"), y: 3 },
            { x: new Date("2022-03-28"), y: 4 },
            { x: new Date("2022-03-30"), y: 5 },
            { x: new Date("2022-03-31"), y: 6 },
            { x: new Date("2022-04-01"), y: 7 },
            { x: new Date("2022-04-11"), y: 7 },
            { x: new Date("2022-04-21"), y: 9 },
          ]}
        /> */}
      </VictoryChart>
      <VictoryChart theme={VictoryTheme.material} height={300}>
        <VictoryAxis tickValues={[2, 4, 6, 8]} />
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={[
            { x: new Date("2022-03-25"), y: 2 },
            { x: new Date("2022-03-26"), y: 3 },
            { x: new Date("2022-03-28"), y: 5 },
            { x: new Date("2022-03-30"), y: 4 },
            { x: new Date("2022-03-31"), y: 7 },
            { x: new Date("2022-04-01"), y: 8 },
            { x: new Date("2022-04-11"), y: 9 },
            { x: new Date("2022-04-21"), y: 50 },
          ]}
        />
        <VictoryLine
          style={{
            data: { stroke: "#caaa31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={[
            { x: new Date("2022-03-25"), y: 2 },
            { x: new Date("2022-03-26"), y: 3 },
            { x: new Date("2022-03-28"), y: 4 },
            { x: new Date("2022-03-30"), y: 5 },
            { x: new Date("2022-03-31"), y: 6 },
            { x: new Date("2022-04-01"), y: 7 },
            { x: new Date("2022-04-11"), y: 7 },
            { x: new Date("2022-04-21"), y: 9 },
          ]}
        />
      </VictoryChart>
    </View>
  );
}

// let newStats: PlayersStats = playerStats;

// console.log("use effect");

// for (let i = 0; i < matches.length; i++) {
//   let date = matches[i].date;

//   for (let j = 0; j < matches[i].goals.length; j++) {
//     let goal = matches[i].goals[j];
//     let scorer = goal.goal;
//     let assister = goal.assist;

//     let player = newStats.players.find((p) => p.player == scorer);
//     console.log(i);
//     console.log(scorer, player);

//     if (player) {
//       if (player.stats.length == 0) {
//         player.stats.push({ date: date, goals: 1, assists: 0 });
//       } else {
//         const lastStat = player.stats[player.stats.length - 1];
//         if (lastStat.date == date) {
//           lastStat.goals = lastStat.goals + 1;
//         } else {
//           player.stats.push({
//             date: date,
//             goals: lastStat.goals + 1,
//             assists: lastStat.assists,
//           });
//         }
//       }
//     } else {
//       newStats.players.push({
//         player: scorer,
//         stats: [{ date: date, goals: 1, assists: 0 }],
//       });
//     }

//     if (assister) {
//       player = newStats.players.find((p) => p.player == assister);

//       if (player) {
//         if (player.stats.length == 0) {
//           player.stats.push({ date: date, goals: 0, assists: 1 });
//         } else {
//           const lastStat = player.stats[player.stats.length - 1];
//           if (lastStat.date == date) {
//             lastStat.assists = lastStat.assists + 1;
//           } else {
//             player.stats.push({
//               date: date,
//               assists: lastStat.assists + 1,
//               goals: lastStat.goals,
//             });
//           }
//         }
//       } else {
//         newStats.players.push({
//           player: assister,
//           stats: [{ date: date, goals: 0, assists: 1 }],
//         });
//       }
//     }
//   }
// }
// setPlayerStats(newStats);
// console.log(newStats);
