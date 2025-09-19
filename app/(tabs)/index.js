import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import HomeGoc from '../homegoc.js';
import Login from '../Login';
import { useRouter } from 'expo-router';

  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  if (!isLoggedIn) {
    return <Login />;
  }
  const firstChar = user?.username?.[0]?.toUpperCase() || '?';
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.avatar}
        onPress={() => router.push('/UserInfo')}
        activeOpacity={0.7}
      >
        <Text style={styles.avatarText}>{firstChar}</Text>
      </TouchableOpacity>
      <HomeGoc />
    </View>
  );
// ...existing code...

const styles = StyleSheet.create({
  avatar: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
