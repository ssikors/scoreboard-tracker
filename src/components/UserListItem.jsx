import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export const UserListItem = ({ item }) => {
  return (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{item.Name}</Text>
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

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.41,

    elevation: 2
  },
  username: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  statistic: {
    fontSize: 14,
    color: "dimgray",
  },
});
