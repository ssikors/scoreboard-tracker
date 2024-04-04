import { SQLiteDatabase } from "expo-sqlite";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SQLite from "expo-sqlite/next";
import { useRouter } from "expo-router";

interface Props {
  item: any;
  db: SQLite.SQLiteDatabase;
}
export const UserListItem = ({ item, db }: Props) => {
  const [deleteState, setDeleteState] = useState(false);
  const router = useRouter();

  const deleteUser = () => {
    const id = item.PlayerId;
    db.execSync(
      `DELETE FROM Goals WHERE ScorerId = ${id} OR AssistId = ${id}; DELETE FROM Players WHERE PlayerId = ${id};`
    );
    router.push("/");
  };

  return (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{item.Name}</Text>
      {deleteState ? (
        <>
          <Pressable
            onPress={() => {
              deleteUser();
            }}
          >
            <Text style={{ color: "#e00" }}>Are you sure?</Text>
            <Text style={{ color: "#e00", fontSize: 7 }}>
              All associated goals will be deleted
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setDeleteState(false);
            }}
          >
            <Text>Cancel</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          onPress={() => {
            setDeleteState(true);
          }}
        >
          <Icon name="close" size={30} color="#c40001"></Icon>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

    elevation: 2,
  },
  username: {
    fontSize: 18,
    marginHorizontal: 6,
  },
  statistic: {
    fontSize: 14,
    color: "dimgray",
  },
});
