import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function Product({ name, price, thumbnail, onPress, smallThumb }) {
  return (
    <TouchableOpacity style={[styles.card, smallThumb && styles.cardSmall]} onPress={onPress}>
      <Image
        style={[styles.thumb, smallThumb && styles.thumbSmall]}
        source={{ uri: thumbnail }}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, smallThumb && styles.nameSmall]} numberOfLines={1}>{name}</Text>
        <Text style={[styles.price, smallThumb && styles.priceSmall]}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    elevation: 1,
    marginVertical: 10,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  cardSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    marginVertical: 6,
    minHeight: 70,
  },
  thumb: {
    height: 260,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    backgroundColor: '#eee',
  },
  thumbSmall: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 14,
    marginBottom: 0,
    backgroundColor: '#eee',
  },
  infoContainer: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  nameSmall: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#d2691e',
  },
  priceSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d2691e',
    marginBottom: 0,
  },
});
