import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import HomeGoc from '../homegoc.js';
import Login from '../Login';

export default function Main() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Login />;
  }
  return (
    <View style={{ flex: 1 }}>
      <HomeGoc />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
