import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite/next";
import { Link, useFocusEffect } from "expo-router";
const db = SQLite.openDatabaseSync("main");

export interface Match {
  MatchId: number;
  Date: string;
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMatches();
    }, [])
  );

  useEffect(() => {
    getMatches();
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
            <Text>Matchday:</Text>
            <Text> {item.Date}</Text>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "#eee",
  },
  match: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    borderRadius: 14,
    fontSize: 24,
    margin: 5,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
  },
});
