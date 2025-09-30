import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';


export const CartContext = createContext();


export function CartProvider(props) {
  const [items, setItems] = useState([]);
  const { username } = useAuth();

  // Khi username thay đổi (login/logout), fetch cart từ backend
  useEffect(() => {
    async function fetchCart() {
      if (!username) {
        setItems([]);
        return;
      }
      try {
        let res = await fetch(`http://103.249.117.201:12732/carts?username=${encodeURIComponent(username)}`);
        let data = await res.json();
        // Nếu chưa có cart cho username, tạo mới
        if (!Array.isArray(data) || data.length === 0) {
          await fetch(`http://103.249.117.201:12732/carts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, items: [] })
          });
          // fetch lại cart vừa tạo
          res = await fetch(`http://103.249.117.201:12732/carts?username=${encodeURIComponent(username)}`);
          data = await res.json();
        }
        // Chỉ lấy cart có username === username (so sánh tuyệt đối)
        const userCart = Array.isArray(data) ? data.find(cart => cart.username === username) : null;
        if (userCart && userCart.items) {
          const itemsWithProduct = await Promise.all(
            userCart.items.map(async (item) => {
              let product = null;
              try {
                const res = await fetch(`http://103.249.117.201:12732/products/${item.productId}`);
                product = await res.json();
              } catch {}
              return {
                id: item.productId,
                qty: item.quantity,
                product: product || { _id: item.productId },
                totalPrice: product && product.price ? product.price * item.quantity : 0,
                username: userCart.username
              };
            })
          );
          setItems(itemsWithProduct);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
    }
    fetchCart();
  }, [username]);

  async function addToCart(product) {
    if (!product || typeof product !== 'object' || product.price == null || !product._id) {
      console.error('❌ Dữ liệu sản phẩm không hợp lệ:', product);
      return;
    }
    if (!username) {
      console.error('❌ Không có username, không thể thêm vào cart');
      return;
    }
    const id = product._id.toString();
    try {
      // Lấy cart hiện tại của user theo username
      let res = await fetch(`http://103.249.117.201:12732/carts?username=${encodeURIComponent(username)}`);
      let data = await res.json();
      let cartId = null;
      let itemsArr = [];
      if (!Array.isArray(data) || data.length === 0) {
        // Nếu chưa có cart thì tạo mới
        await fetch(`http://103.249.117.201:12732/carts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, items: [] })
        });
        // fetch lại cart vừa tạo
        res = await fetch(`http://103.249.117.201:12732/carts?username=${encodeURIComponent(username)}`);
        data = await res.json();
      }
      if (Array.isArray(data) && data.length > 0) {
        const userCart = data.find(cart => cart.username === username);
        if (userCart) {
          cartId = userCart._id;
          itemsArr = userCart.items || [];
        }
      }
      // Kiểm tra sản phẩm đã có trong cart chưa
      const existing = itemsArr.find(item => item.productId === id || item.productId?.toString() === id);
      if (existing) {
        // Tăng số lượng
        itemsArr = itemsArr.map(item =>
          (item.productId === id || item.productId?.toString() === id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        itemsArr.push({ productId: id, quantity: 1 });
      }
      // Gửi lên backend
      if (cartId) {
        await fetch(`http://103.249.117.201:12732/carts/${cartId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: itemsArr })
        });
      } else {
        // Trường hợp rất hiếm, nhưng nếu vẫn chưa có cartId thì tạo mới
        await fetch(`http://103.249.117.201:12732/carts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, items: itemsArr })
        });
      }
      // Cập nhật lại cart local (fetch lại cart để đồng bộ product info)
      try {
        const res2 = await fetch(`http://103.249.117.201:12732/carts?username=${encodeURIComponent(username)}`);
        const data2 = await res2.json();
        // Chỉ lấy cart có username === username (so sánh tuyệt đối)
        const userCart2 = Array.isArray(data2) ? data2.find(cart => cart.username === username) : null;
        if (userCart2 && userCart2.items) {
          const itemsWithProduct = await Promise.all(
            userCart2.items.map(async (item) => {
              let product = null;
              try {
                const res = await fetch(`http://103.249.117.201:12732/products/${item.productId}`);
                product = await res.json();
              } catch {}
              return {
                id: item.productId,
                qty: item.quantity,
                product: product || { _id: item.productId },
                totalPrice: product && product.price ? product.price * item.quantity : 0,
                username
              };
            })
          );
          setItems(itemsWithProduct);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
    } catch (err) {
      console.error('❌   Không thể đồng bộ cart backend:', err);
    }
  }

  async function removeFromCart(product) {
    if (!product || typeof product !== 'object' || !product._id) return;
    if (!username) return;
    const id = product._id.toString();
    try {
      // Lấy cart hiện tại của user theo username
      let res = await fetch(`http://103.249.117.201:12732/carts?username=${encodeURIComponent(username)}`);
      let data = await res.json();
      let cartId = null;
      let itemsArr = [];
      if (Array.isArray(data) && data.length > 0) {
        const userCart = data.find(cart => cart.username === username);
        if (userCart) {
          cartId = userCart._id;
          itemsArr = userCart.items || [];
        }
      }
      // Giảm số lượng hoặc xóa sản phẩm khỏi cart
      const existing = itemsArr.find(item => item.productId === id || item.productId?.toString() === id);
      if (existing) {
        if (existing.quantity <= 1) {
          itemsArr = itemsArr.filter(item => !(item.productId === id || item.productId?.toString() === id));
        } else {
          itemsArr = itemsArr.map(item =>
            (item.productId === id || item.productId?.toString() === id)
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }
        // Gửi lên backend
        if (cartId) {
          await fetch(`http://103.249.117.201:12732/carts/${cartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsArr })
          });
        }
      }
      // Cập nhật lại cart local (fetch lại cart để đồng bộ product info)
      try {
        const res2 = await fetch(`http://103.249.117.201:12732/carts?username=${encodeURIComponent(username)}`);
        const data2 = await res2.json();
        const userCart2 = Array.isArray(data2) ? data2.find(cart => cart.username === username) : null;
        if (userCart2 && userCart2.items) {
          const itemsWithProduct = await Promise.all(
            userCart2.items.map(async (item) => {
              let product = null;
              try {
                const res = await fetch(`http://103.249.117.201:12732/products/${item.productId}`);
                product = await res.json();
              } catch {}
              return {
                id: item.productId,
                qty: item.quantity,
                product: product || { _id: item.productId },
                totalPrice: product && product.price ? product.price * item.quantity : 0,
                username
              };
            })
          );
          setItems(itemsWithProduct);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
    } catch (err) {
      console.error('❌   Không thể cập nhật cart backend:', err);
    }
  }


  function getItemsCount() {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }

  function getTotalPrice() {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  return (
    <CartContext.Provider
      value={{ items, setItems, getItemsCount, addToCart, removeFromCart, getTotalPrice }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
