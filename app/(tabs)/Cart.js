import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

import { CartContext } from '../../context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { items, getTotalPrice } = useContext(CartContext);

  function Totals() {
    const total = getTotalPrice();
    return (
      <View style={styles.cartLineTotal}>
        <Text style={[styles.lineLeft, styles.lineTotal]}>Total</Text>
        <Text style={styles.lineRight}> {total} đ</Text>
      </View>
    );
  }

  function renderItem({ item }) {
    const name = item?.product?.name || 'Sản phẩm';
    return (
      <View style={styles.cartLine}>
        <Text style={styles.lineLeft}>
          {name} x {item.qty}
        </Text>
        <Text style={styles.lineRight}> {item.totalPrice} đ</Text>
      </View>
    );
  }


  return (
    <View style={{ marginTop: 40, flex: 1, backgroundColor: '#fff' }}>
      {items.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18 }}>Giỏ hàng của bạn đang trống.</Text>
        </View>
      ) : (
        <FlatList
          style={styles.itemsList}
          contentContainerStyle={styles.itemsListContainer}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?.product?._id?.toString() || item?.id?.toString() || index.toString()
          }

          ListFooterComponent={Totals}
        />
      )}

      <View style={{ padding: 16 }}>
        <Button
          title="Đặt hàng"
          onPress={() => router.push('/Checkout')} 
          disabled={items.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartLine: {
    flexDirection: 'row',
  },
  cartLineTotal: {
    flexDirection: 'row',
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  lineTotal: {
    fontWeight: 'bold',
  },
  lineLeft: {
    fontSize: 20,
    lineHeight: 40,
    color: '#333333',
  },
  lineRight: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 40,
    color: '#333333',
    textAlign: 'right',
  },
  itemsList: {
    backgroundColor: '#eeeeee',
  },
  itemsListContainer: {
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});