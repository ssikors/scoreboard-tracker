import Icon from "react-native-vector-icons/FontAwesome";
import ShoeIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { DataTable } from "react-native-paper";
import { StyleSheet } from "react-native";

export interface Score {
  player: string;
  assists: number;
  goals: number;
}

type Props = {
  scores: Score[];
};

export const Scoreboard = ({ scores }: Props) => {
  return (
    <DataTable style={styles.table}>
      <DataTable.Header style={styles.header}>
        <DataTable.Title textStyle={styles.title}>Player</DataTable.Title>
        <DataTable.Title textStyle={styles.icon}>
          <Icon name="soccer-ball-o" size={20} color="#0a0" />
        </DataTable.Title>
        <DataTable.Title textStyle={styles.icon}>
          <ShoeIcon name="shoe-cleat" color="#0aa" size={26} />
        </DataTable.Title>
      </DataTable.Header>
      {scores.sort((a, b) => b.goals - a.goals).map((item) => (
        <DataTable.Row key={item.player + item.goals} style={styles.row}>
          <DataTable.Cell textStyle={styles.cell} key="player">{item.player[0].toUpperCase() + item.player.slice(1)}</DataTable.Cell>
          <DataTable.Cell textStyle={styles.cell} key="goals">{item.goals}</DataTable.Cell>
          <DataTable.Cell textStyle={styles.cell} key="assists">{item.assists}</DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

const styles = StyleSheet.create({
  table: { marginTop: 16, paddingBottom:1, borderBottomWidth: 1},
  header: {
    backgroundColor: "#ddd",
    borderWidth: 1,
    borderColor: "#999",
  },
  title: {
    fontSize: 20,
    color: "black",
  },
  icon: {
  },
  row: {
    borderColor: "#888",
    backgroundColor: "white"
  },
  cell: {
    fontSize: 16,
  }
});
