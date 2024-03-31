import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import users from "../../assets/users.json";
import { Link } from "expo-router";

import { UserListItem } from "../components/UserListItem";

import { useEffect, useLayoutEffect, useState } from "react";
import * as SQLite from "expo-sqlite/next";
const db = SQLite.openDatabaseSync("main");

export default function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    createTables();
    getPlayers();
  }, []);

  const getPlayers = () => {
    const newPlayers = db.getAllSync("SELECT * FROM PLAYERS");
    setPlayers(newPlayers);
    console.log(newPlayers)
  };

  const createTables = () => {
    db.execSync(
      "CREATE TABLE IF NOT EXISTS " +
        "Players " +
        "(PlayerId INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL);"
    );
    db.execSync(
      "CREATE TABLE IF NOT EXISTS " +
        "Goals " +
        "(GoalId INTEGER PRIMARY KEY AUTOINCREMENT, ScorerId INTEGER NOT NULL, AssistId INTEGER, Description TEXT," +
        " FOREIGN KEY(ScorerId) REFERENCES Players(PlayerId), " +
        " FOREIGN KEY(AssistId) REFERENCES Players(PlayerId));"
    );

    db.execSync(
      "CREATE TABLE IF NOT EXISTS " +
        "Matches " +
        "(MatchId INTEGER PRIMARY KEY AUTOINCREMENT, Date DATE NOT NULL);"
    );
  };

  return (
    <View style={styles.container}>
      <Link style={styles.statistics} href={"/add-player"}>
        Add player
      </Link>
      <FlatList
        data={players}
        renderItem={({ item }) => <UserListItem key={item.Name} item={item} />}
      ></FlatList>
      <Link style={styles.statistics} href={"/statistics"}>
        View statistics
      </Link>
      <Link style={styles.match} href={"/add-match"}>
        New match
      </Link>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe",
    justifyContent: "center",
    paddingTop: 15,
  },
  statistics: {
    textAlign: "center",
    margin: 30,
  },
  match: {
    marginBottom: 40,
    textAlign: "center",
  },
});
