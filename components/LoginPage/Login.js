import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

const Login = ({ registerUser }) => {
  return (
    <View style={styles.container}>
      <Text>{"Login Page"}</Text>
      <Button title="Sign In" />
    </View>
  );
};

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Login;
