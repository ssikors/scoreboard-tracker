import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import users from "../../assets/users.json";
import { Link } from "expo-router";

import { UserListItem } from "../../src/components/UserListItem";

export default function App() {
  return (
    <View style={styles.container}>
      <Link style={styles.statistics} href={'/statistics'}>View statistics</Link>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserListItem key={item.name} item={item} />}
      ></FlatList>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe",
    justifyContent: "center",
    marginTop: 40,
  },
  statistics: {
    textAlign: "center",
  }
});
