import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ConversationListScreen() {
  const { username, role } = useAuth();
  const [conversations, setConversations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Chỉ admin mới xem danh sách hội thoại
    if (role === 'admin') {
      fetch('http://103.249.117.201:12732/messages/conversations/list')
        .then(res => res.json())
        .then(data => setConversations(data))
        .catch(() => setConversations([]));
    }
  }, [role]);

  if (role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text>Chỉ admin mới xem được danh sách hội thoại.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách hội thoại</Text>
      <FlatList
        data={conversations}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('MessageScreen', { conversationId: item })}
          >
            <Text style={styles.username}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1976d2',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  username: {
    fontSize: 16,
    color: '#333',
  },
});
