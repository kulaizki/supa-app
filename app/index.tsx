import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {};
  const onSignUpPress = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Galaxies.dev</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Email"
        placeholderTextColor="#fff"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputField}
        placeholder="Password"
        placeholderTextColor="#fff"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={{ color: "#fff" }}>Sign In</Text>
      </TouchableOpacity>
      <Button title="Sign Up" onPress={onSignUpPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    padding: 20,
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    margin: 50,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#2b825b",
    borderRadius: 4,
    padding: 10,
    color: "#fff",
    backgroundColor: "#363636",
  },
  button: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
});

export default Page;
