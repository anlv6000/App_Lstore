import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StatsScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSample, setShowSample] = useState(false);
  const totalItemsSold = orders.reduce((sum, o) => {
    if (!Array.isArray(o.items)) return sum;
    return sum + o.items.reduce((s, i) => s + (i.quantity || 0), 0);
  }, 0);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('https://ctechlab-e.io.vn/deliveries');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu đơn hàng');
      setOrders([]);
    }
    setLoading(false);
  }

  function computeRevenue(order) {
    if (!order) return 0;

    // Ưu tiên dùng totalPrice nếu có
    if (typeof order.totalPrice === 'number' && !isNaN(order.totalPrice)) {
      return order.totalPrice;
    }

    // Nếu không có totalPrice, tính từ items
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + price * quantity;
      }, 0);
    }

    return 0;
  }


  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + computeRevenue(o), 0);

  const byStatus = orders.reduce((acc, o) => {
    const st = o.status || 'unknown';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  // sales by day (last 30 days)
  const salesByDay = {};
  const now = new Date();
  for (const o of orders) {
    const d = o.createdAt ? new Date(o.createdAt) : null;
    if (!d || isNaN(d.getTime())) continue;
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays > 30) continue;
    const key = d.toISOString().slice(0, 10);
    salesByDay[key] = (salesByDay[key] || 0) + computeRevenue(o);
  }

  const recentDays = Object.keys(salesByDay).sort().slice(-15); // last up to 15 days

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Thống kê đơn hàng</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Tổng đơn hàng</Text>
            <Text style={styles.cardValue}>{totalOrders}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Tổng sản phẩm đã bán</Text>
            <Text style={styles.cardValue}>{totalItemsSold}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Tổng doanh thu</Text>
            <Text style={styles.cardValue}>{totalRevenue.toLocaleString('vi-VN')}₫</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Phân theo trạng thái</Text>
            {Object.keys(byStatus).length === 0 ? (
              <Text>Không có đơn hàng</Text>
            ) : (
              Object.entries(byStatus).map(([k, v]) => (
                <View key={k} style={styles.statusRow}>
                  <Text style={styles.statusKey}>{k}</Text>
                  <Text style={styles.statusVal}>{v}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Doanh thu theo ngày (gần đây)</Text>
            {recentDays.length === 0 ? (
              <Text>Không có dữ liệu gần đây.</Text>
            ) : (
              recentDays.map((d) => (
                <View key={d} style={styles.statusRow}>
                  <Text style={styles.statusKey}>{d}</Text>
                  <Text style={styles.statusVal}>{(salesByDay[d] || 0).toLocaleString('vi-VN')}₫</Text>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity style={styles.refreshBtn} onPress={fetchOrders}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Làm mới</Text>
          </TouchableOpacity>

          {/* Debug: show sample orders when revenue is zero to help inspect schema */}
          {totalRevenue === 0 && orders.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <TouchableOpacity style={{ padding: 8 }} onPress={() => setShowSample(s => !s)}>
                <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>{showSample ? 'Ẩn mẫu đơn hàng' : 'Hiển thị mẫu đơn hàng (debug)'}</Text>
              </TouchableOpacity>
              {showSample && (
                <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 8, marginTop: 8, borderWidth: 1, borderColor: '#eee' }}>
                  {orders.slice(0, 3).map((o, idx) => (
                    <View key={idx} style={{ marginBottom: 10 }}>
                      <Text style={{ fontWeight: '700', marginBottom: 4 }}>Order #{idx + 1}:</Text>
                      <Text style={{ fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' }}>{JSON.stringify(o, null, 2).slice(0, 2000)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#f9f9fb', padding: 12, borderRadius: 10, marginBottom: 12 },
  cardLabel: { color: '#555', marginBottom: 6 },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: '#1976d2' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  statusKey: { color: '#333' },
  statusVal: { fontWeight: '700' },
  refreshBtn: { backgroundColor: '#1976d2', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
});
