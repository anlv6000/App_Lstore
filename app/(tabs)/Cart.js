import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CartContext } from '../../context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { items, getTotalPrice, addToCart, removeFromCart } = useContext(CartContext);

  function Totals() {
    // Tính lại tổng: nếu là preorder thì giá = 1/10
    const total = items.reduce((sum, item) => {
      let price = item?.product?.price || 0;
      if (item?.product?.type === 'preorder' || /(PreOrder)/i.test(item?.product?.name || '')) {
        price = Math.floor(price / 10);
      }
      return sum + price * item.qty;
    }, 0);
    return (
      <View style={styles.cartLineTotal}>
        <Text style={[styles.lineLeft, styles.lineTotal]}>Total: </Text>
        <Text style={[styles.lineRight, { display: 'flex', color: '#d2691e', fontWeight: 'bold', fontSize: 18, textAlign: 'right', minWidth: 80 }]}> {total} đ</Text>
      </View>
    );
  }

  function renderItem({ item }) {
    let name = item?.product?.name || 'Sản phẩm';
    const image = item?.product?.image || item?.product?.img || null;
    let isPreorder = false;
    let price = item?.product?.price || 0;
    // Kiểm tra nếu là preorder (theo type hoặc tên có (PreOrder))
    if (item?.product?.type === 'preorder' || /\(PreOrder\)/i.test(name)) {
      isPreorder = true;
      price = Math.floor((item?.product?.price || 0) / 10);
      // Đảm bảo tên có label preorder
      if (!/\(PreOrder\)/i.test(name)) {
        name = name + ' (PreOrder)';
      }
    }
    return (
      <View style={styles.cartLine}>
        {image ? (
          <View style={styles.imageBox}>
            <img
              src={image}
              alt={name}
              style={{ width: 44, height: 44, borderRadius: 8, marginRight: 10, objectFit: 'cover' }}
            />
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.lineLeft} numberOfLines={1}>
            {name}
            {isPreorder && <Text style={{ color: '#007aff', fontSize: 12 }}> (PreOrder)</Text>}
          </Text>
        </View>
        <View style={styles.qtyBox}>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.product)}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.product)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.priceText}>{item.qty > 0 ? price * item.qty : 0} đ</Text>
        </View>
      </View>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 40 }}>
      {items.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18 }}>Giỏ hàng của bạn đang trống.</Text>
        </View>
      ) : (
        <FlatList
          style={styles.itemsList}
          contentContainerStyle={{ ...styles.itemsListContainer, paddingBottom: 120 }}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?.product?._id?.toString() || item?.id?.toString() || index.toString()
          }
          ListFooterComponent={Totals}
        />
      )}
      <View style={styles.orderButtonBox}>
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
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  imageBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 6,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    lineHeight: 28,
    color: '#333333',
  },
  lineRight: {
    display: 'none',
  },
  qtyBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
    marginLeft: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d2691e',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 6,
    minWidth: 18,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#d2691e',
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'right',
  },
  itemsList: {
    backgroundColor: '#f6f6f6',
  },
  itemsListContainer: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  orderButtonBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
});