import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export default function MessageScreen() {
  const { username, role } = useAuth();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();
  const socket = useRef(null);
  const pollingRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const conversationId = role === 'admin' ? params.conversationId : username;
  const chatWith = role === 'admin' ? params.conversationId : 'admin';

  // Kết nối socket và lắng nghe tin nhắn realtime
  useEffect(() => {
    if (!conversationId) return;

    socket.current = io('https://ctechlab-e.io.vn');
    socket.current.emit('join', conversationId);

    socket.current.on('newMessage', msg => {
      if (!msg?._id) return;
      setMessages(prev => {
        const exists = prev.some(m => m.id === msg._id);
        if (exists) return prev;
        return [...prev, {
          id: msg._id,
          sender: msg.from,
          text: msg.message,
          timestamp: msg.timestamp
        }];
      });
    });

    // Polling nhẹ mỗi 0.5s để đảm bảo tin nhắn mới luôn hiển thị
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`https://ctechlab-e.io.vn/messages/${conversationId}`);
        const data = await res.json();
        const latest = data.map(msg => ({
          id: msg._id,
          sender: msg.from,
          text: msg.message,
          timestamp: msg.timestamp
        }));
        if (latest.length > messages.length) {
          setMessages(latest);
        }
      } catch { }
    }, 500);

    return () => {
      socket.current.disconnect();
      clearInterval(pollingRef.current);
    };
  }, [conversationId]);

  // Scroll xuống cuối mỗi khi messages thay đổi
  useEffect(() => {
    if (messages.length > 0 && isAtBottom) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);


  // Lấy tin nhắn ban đầu từ backend
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    fetch(`https://ctechlab-e.io.vn/messages/${conversationId}`)
      .then(res => res.json())
      .then(async data => {
        const msgs = data.map(msg => ({
          id: msg._id,
          sender: msg.from,
          text: msg.message,
          timestamp: msg.timestamp
        }));

        // Nếu là user, chưa có tin nhắn thì gửi tự động 'Xin chào shop!'
        if (role !== 'admin' && msgs.length === 0) {
          try {
            const res2 = await fetch('https://ctechlab-e.io.vn/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: username,
                to: 'admin',
                message: 'Xin chào shop!',
                conversationId
              })
            });
            if (res2.ok) {
              const saved = await res2.json();
              msgs.push({
                id: saved._id,
                sender: saved.from,
                text: saved.message,
                timestamp: saved.timestamp
              });
            }
          } catch { }
        }

        setMessages(msgs);
        setLoading(false);
      })
      .catch(() => {
        setMessages([]);
        setLoading(false);
      });
  }, [conversationId]);

  // Gửi tin nhắn lên backend và cập nhật giao diện ngay
  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;
    const newMsg = {
      from: username,
      to: chatWith,
      message: input,
      conversationId
    };
    const tempId = Date.now().toString(); // ID tạm để hiển thị ngay
    setMessages(prev => [...prev, {
      id: tempId,
      sender: username,
      text: input,
      timestamp: new Date().toISOString()
    }]);
    setInput('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      await fetch('http://103.249.117.201:12732/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
      // Tin nhắn thật sẽ được nhận qua socket hoặc polling
    } catch { }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {role === 'admin' ? `Chat với ${chatWith}` : 'LTStore Chat'}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          extraData={messages}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.sender === username ? styles.myMessage : styles.otherMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          style={styles.messageList}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const paddingToBottom = 20;
            const atBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
            setIsAtBottom(atBottom);
          }}
          scrollEventThrottle={100}
        />

      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
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
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageRow: {
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});
