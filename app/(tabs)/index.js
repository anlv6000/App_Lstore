import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import HomeGoc from '../homegoc.js';

export default function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chào mừng đến với LTStore!</Text>
        <Button title="Đăng nhập" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeGoc />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20,
  },
});