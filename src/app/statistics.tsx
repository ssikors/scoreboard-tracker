import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import matches from "../../assets/matches.json";

export interface PlayerStat {
  date?: string;
  goals?: number;
  assists?: number;
}

export interface Player {
  player: string;
  stats: PlayerStat[];
}

export interface PlayersStats {
  players: Player[];
}

export default function StatisticsScreen() {
  const [playerStats, setPlayerStats] = useState<PlayersStats>({ players: [] });

  useLayoutEffect(() => {
    let newStats: PlayersStats = playerStats;

    console.log("use effect");

    for (let i = 0; i < matches.length; i++) {
      let date = matches[i].date;

      for (let j = 0; j < matches[i].goals.length; j++) {
        let goal = matches[i].goals[j];
        let scorer = goal.goal;
        let assister = goal.assist;

        let player = newStats.players.find((p) => p.player == scorer);
        console.log(i);
        console.log(scorer, player);

        if (player) {
          if (player.stats.length == 0) {
            player.stats.push({ date: date, goals: 1, assists: 0 });
          } else {
            const lastStat = player.stats[player.stats.length - 1];
            if (lastStat.date == date) {
              lastStat.goals = lastStat.goals + 1;
            } else {
              player.stats.push({
                date: date,
                goals: lastStat.goals + 1,
                assists: lastStat.assists,
              });
            }
          }
        } else {
          newStats.players.push({
            player: scorer,
            stats: [{ date: date, goals: 1, assists: 0 }],
          });
        }

        if (assister) {
          player = newStats.players.find((p) => p.player == assister);

          if (player) {
            if (player.stats.length == 0) {
              player.stats.push({ date: date, goals: 0, assists: 1 });
            } else {
              const lastStat = player.stats[player.stats.length - 1];
              if (lastStat.date == date) {
                lastStat.assists = lastStat.assists + 1;
              } else {
                player.stats.push({
                  date: date,
                  assists: lastStat.assists + 1,
                  goals: lastStat.goals,
                });
              }
            }
          } else {
            newStats.players.push({
              player: assister,
              stats: [{ date: date, goals: 0, assists: 1 }],
            });
          }
        }
      }
    }
    setPlayerStats(newStats);
    console.log(newStats);
  }, []);

  return (
    <View>
      <FlatList
        data={playerStats.players}
        renderItem={({ item }) => <Text>{item.player}</Text>}
      ></FlatList>
    </View>
  );
}
