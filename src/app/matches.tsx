import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite/next";
import { Link } from "expo-router";
const db = SQLite.openDatabaseSync("main");

export interface Match {
  MatchId: number;
  Date: string;
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    getMatches();
    console.log(matches);
  }, []);

  const getMatches = () => {
    const newMatches: Match[] = db.getAllSync("SELECT * FROM Matches;");
    setMatches([...newMatches]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {matches.map((item) => (
          <Link
            style={styles.match}
            href={`/match/${item.MatchId}`}
            key={item.MatchId}
          >
            <Text>Match {item.MatchId}</Text>
            <Text>: {item.Date}</Text>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe",
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  match: {
    flex: 1,
    justifyContent: "space-between",
    textAlign: "center",
    fontSize: 24,
    margin: 5,
    padding: 6,
    backgroundColor: "#ffa",
  },
});
