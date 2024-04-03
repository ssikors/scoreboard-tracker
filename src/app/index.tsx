import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import users from "../../assets/users.json";
import { Link, useFocusEffect } from "expo-router";

import { UserListItem } from "../components/UserListItem";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import * as SQLite from "expo-sqlite/next";
const db = SQLite.openDatabaseSync("main");

export default function App() {
  const [players, setPlayers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getPlayers();
    }, [])
  );

  useEffect(() => {
    createTables();
    getPlayers();
  }, []);

  const getPlayers = () => {
    const newPlayers = db.getAllSync("SELECT * FROM PLAYERS");
    setPlayers(newPlayers);
    console.log(newPlayers);
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
        "(GoalId INTEGER PRIMARY KEY AUTOINCREMENT, ScorerId INTEGER NOT NULL, AssistId INTEGER, Description TEXT, Date DATE NOT NULL," +
        " FOREIGN KEY(ScorerId) REFERENCES Players(PlayerId), " +
        " FOREIGN KEY(AssistId) REFERENCES Players(PlayerId));"
    );

    db.execSync(
      "CREATE TABLE IF NOT EXISTS " +
        "Matches " +
        "(MatchId INTEGER PRIMARY KEY AUTOINCREMENT, Date DATE UNIQUE NOT NULL);"
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.links}>
        <Link style={styles.link} href={"/statistics"}>
          <Text style={styles.linkText}>Statistics</Text>
        </Link>
        <Link style={styles.link} href={"/matches"}>
          <Text style={styles.linkText}>Matches</Text>
        </Link>
        <Link style={styles.link} href={"/add-match"}>
          <Text style={styles.linkText}>New match</Text>
        </Link>
      </View>
      <Link style={styles.add} href={"/add-player"}>
        <Text style={[styles.linkText, {color: "white"}]}>Add player</Text>
      </Link>
      <FlatList
        style={styles.flatlist}
        data={players}
        renderItem={({ item }) => <UserListItem key={item.Name} item={item} />}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
  },
  flatlist: {
    backgroundColor: "#fff",
  },
  links: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 0,
    marginBottom: 10,
    marginTop: 8
  },
  add: {
    textAlign: "center",
    margin: 8,
    marginHorizontal: 110,
    padding: 4,
    backgroundColor: "#e80",
    borderRadius: 10,
    borderWidth: 1
  },
  link: {
    backgroundColor: "#fcfcfc",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor:"#999"
  },
  linkText: {
    fontSize: 18,
  },
});
