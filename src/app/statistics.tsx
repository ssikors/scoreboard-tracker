import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import SQLite from "react-native-sqlite-storage";

export interface PlayerStat {
  date?: string;
  goals?: number;
  assists?: number;
}

export interface Player {
  player: string;
  goals: DataPoint[];
  assists: DataPoint[];
}

export interface PlayersStats {
  players: Player[];
}

export interface DataPoint {
  x: Date;
  y: number;
}


export default function StatisticsScreen() {
  const [playerStats, setPlayerStats] = useState<PlayersStats>({ players: [] });

  return (
    <View>
      <VictoryChart theme={VictoryTheme.material} height={300}>
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
      <VictoryChart theme={VictoryTheme.material} height={300}>
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
