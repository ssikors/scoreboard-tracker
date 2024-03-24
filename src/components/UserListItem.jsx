
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export const UserListItem = ({ item }) => {
  return (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{item.name}</Text>
      <Text style={styles.statistic}>
        Goals: {item.goals} | Assists: {item.assists}
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  statistic: {
    fontSize: 14,
    color: "dimgray",
  },
})