import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 

import { CartContext } from '../context/CartContext.js';

export function CartIcon() {
  const router = useRouter(); 
  const { getItemsCount } = useContext(CartContext);

  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        onPress={() => router.push('/(tabs)/Cart')}
      >
        Cart ({getItemsCount()})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    backgroundColor: 'orange',
    height: 32,
    padding: 12,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});