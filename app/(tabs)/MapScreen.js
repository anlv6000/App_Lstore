import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const restaurants = [
    {
      title: 'Bếp 1996 cs2',
      lat: 21.020,
      lng: 105.520,
      rating: 4.5,
      description: 'Không gian ấm cúng, món ăn đậm vị Bắc, phục vụ nhanh và thân thiện.'
    },
    {
      title: 'Nhà Hàng Hải Sản Làng Chài',
      lat: 21.022,
      lng: 105.518,
      rating: 4.2,
      description: 'Hải sản tươi sống, chế biến đa dạng, giá cả hợp lý.'
    },
    {
      title: 'Ohio BBQ & Hotpot',
      lat: 21.024,
      lng: 105.519,
      rating: 4.7,
      description: 'Buffet nướng lẩu phong cách Mỹ, nguyên liệu chất lượng cao.'
    },
    // Thêm các nhà hàng khác...
  ];

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert('Quyền vị trí bị từ chối', 'Vui lòng bật quyền vị trí để xem bản đồ.');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        setErrorMsg(err.message || 'Lỗi khi lấy vị trí');
        Alert.alert('Lỗi', err.message || 'Không thể lấy vị trí');
      }
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {restaurants.map((r, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: r.lat, longitude: r.lng }}
            title={r.title}
            onPress={() => setSelectedRestaurant(r)}
          />
        ))}
      </MapView>

      {selectedRestaurant && (
        <View style={styles.infoBox}>
          <Text style={styles.name}>{selectedRestaurant.title}</Text>
          <Text style={styles.rating}>Đánh giá: ⭐ {selectedRestaurant.rating}</Text>
          <Text style={styles.description}>{selectedRestaurant.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});
