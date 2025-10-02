import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
// Component hiển thị đánh giá và trả lời
function ReviewItem({ review, username, onReplySuccess }) {
  const [reply, setReply] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [sending, setSending] = useState(false);

  // Hiển thị replies từ backend
  return (
    <View style={styles.singleReview}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
        <Text style={{ fontWeight: 'bold', marginRight: 6 }}>{review.username}</Text>
        {[1,2,3,4,5].map(star => (
          <Text key={star} style={{ fontSize: 18, color: star <= review.rating ? '#FFD700' : '#ccc' }}>★</Text>
        ))}
      </View>
      <Text style={{ fontSize: 15 }}>{review.comment}</Text>
      <Text style={{ fontSize: 11, color: '#888' }}>{new Date(review.createdAt).toLocaleString()}</Text>
      {/* Hiển thị các reply từ backend */}
      {review.replies && review.replies.length > 0 && (
        <View style={{ marginTop: 6, marginLeft: 12 }}>
          {review.replies.map((rep, idx) => (
            <View key={idx} style={{ backgroundColor: '#e3f2fd', borderRadius: 6, padding: 6, marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold', color: '#388e3c' }}>{rep.user}</Text>
              <Text>{rep.content}</Text>
              <Text style={{ fontSize: 11, color: '#888' }}>{new Date(rep.repliedAt).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      )}
      {/* Nút trả lời */}
      <TouchableOpacity
        style={styles.replyBtn}
        onPress={() => setShowReplyBox(!showReplyBox)}
      >
        <Text style={{ color: '#388e3c', fontWeight: 'bold' }}>Trả lời</Text>
      </TouchableOpacity>
      {showReplyBox && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <TextInput
            style={styles.replyInput}
            value={reply}
            onChangeText={setReply}
            placeholder="Nhập trả lời..."
          />
          <TouchableOpacity
            style={styles.replySendBtn}
            onPress={async () => {
              if (!reply.trim()) return;
              setSending(true);
              try {
                const res = await fetch(`http://103.249.117.201:12732/reviews/reply/${review._id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user: username, content: reply })
                });
                if (res.ok) {
                  setReply('');
                  setShowReplyBox(false);
                  if (onReplySuccess) onReplySuccess();
                } else {
                  Alert.alert('Lỗi', 'Không thể gửi trả lời');
                }
              } catch {
                Alert.alert('Lỗi', 'Không thể gửi trả lời');
              }
              setSending(false);
            }}
            disabled={sending || reply.trim() === ''}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext.js';

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const { addToCart, setItems } = useContext(CartContext);
  const [buying, setBuying] = useState(false);
  const router = require('expo-router').useRouter();

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const response = await fetch(`http://103.249.117.201:12732/products/${productId}`);

        const data = await response.json();
        setProduct(data);
        setMainImage(data.images?.[0]);
      } catch (error) {
        console.error('❌ Lỗi khi lấy chi tiết sản phẩm:', error);
        Alert.alert('Lỗi', 'Không thể tải chi tiết sản phẩm.');
      }
    }

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);




  async function onAddToCart() {
    if (product) {
      let productToAdd = { ...product };
      if (product.type === 'preorder') {
        productToAdd = {
          ...productToAdd,
          price: Math.floor(product.price / 10),
          name: `${product.name} (PreOrder)`
        };
      }
      await addToCart(productToAdd);
    }
  }

  async function onBuyNow() {
    if (!product) return;
    setBuying(true);
    let productToAdd = { ...product };
    if (product.type === 'preorder') {
      productToAdd = {
        ...productToAdd,
        price: Math.floor(product.price / 10),
        name: `${product.name} (PreOrder)`
      };
    }
    setBuying(false);
    // Truyền sản phẩm tạm sang Checkout qua params
    router.push({
      pathname: '/Checkout',
      params: { buyNow: JSON.stringify([{ product: productToAdd, qty: 1 }]) }
    });
  }

  const handleAddToCart = () => {
    onAddToCart();
    if (Platform.OS === 'android' && ToastAndroid) {
      ToastAndroid.show("Đã thêm vào giỏ hàng!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Thông báo", "Đã thêm vào giỏ hàng!");
    }
  };

  const handleBuyNow = () => {
    onBuyNow();
  };

  const { username } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Lấy danh sách đánh giá khi có productId
  useEffect(() => {
    if (!productId) return;
    setLoadingReviews(true);
    fetch(`http://103.249.117.201:12732/reviews/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        const found = data.find(r => r.username === username);
        setMyReview(found || null);
        setLoadingReviews(false);
      })
      .catch(() => { setReviews([]); setLoadingReviews(false); });
  }, [productId, username, submitted]);

  if (!product) {
    return (
      <SafeAreaView>
        <Text style={{ padding: 16 }}>Đang tải sản phẩm...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ backgroundColor: '#fff' }}>
        {mainImage && (
          <Image style={styles.mainImage} source={{ uri: mainImage }} />
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {product.images?.map((imgUrl, index) => (
            <TouchableOpacity key={index} onPress={() => setMainImage(imgUrl)}>
              <Image source={{ uri: imgUrl }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>Giá: {product.price}₫</Text>
          <Text style={styles.detail}>Thương hiệu: {product.brand}</Text>
          <Text style={styles.detail}>Kho: {product.stock}</Text>

          <Text style={styles.status}>
            Trạng thái: {product.type === 'preorder'
              ? `Đặt trước (Giá đặt: ${Math.floor(product.price / 10)}₫)`
              : 'Có sẵn'}
          </Text>

          {product.type === 'preorder' ? (
            <>
              <TouchableOpacity
                onPress={handleAddToCart}
                style={styles.preorderButton}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Đặt trước</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBuyNow}
                style={[styles.preorderButton, { marginTop: 10 }]}
                activeOpacity={0.7}
                disabled={buying}
              >
                <Text style={styles.buttonText}>{buying ? 'Đang xử lý...' : 'Mua ngay'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleAddToCart}
                style={styles.orderButton}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Đặt hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBuyNow}
                style={[styles.orderButton, { marginTop: 10 }]}
                activeOpacity={0.7}
                disabled={buying}
              >
                <Text style={styles.buttonText}>{buying ? 'Đang xử lý...' : 'Mua ngay'}</Text>
              </TouchableOpacity>
            </>
          )}

        </View>



        {/* Đánh giá sản phẩm */}
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewTitle}>Đánh giá sản phẩm</Text>
          {loadingReviews ? (
            <Text>Đang tải đánh giá...</Text>
          ) : (
            <>
              {/* Nếu user đã đánh giá thì chỉ hiển thị đánh giá của mình */}
              {myReview ? (
                <ReviewItem
                  review={myReview}
                  username={username}
                  onReplySuccess={() => setSubmitted(s => !s)}
                  myReview
                />
              ) : (
                <>
                  <View style={styles.starsRow}>
                    {[1,2,3,4,5].map(star => (
                      <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Text style={{ fontSize: 32, color: star <= rating ? '#FFD700' : '#ccc' }}>★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    style={styles.reviewInput}
                    value={review}
                    onChangeText={setReview}
                    placeholder="Viết đánh giá của bạn..."
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.submitReviewBtn}
                    onPress={async () => {
                      try {
                        const res = await fetch('http://103.249.117.201:12732/reviews', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            username,
                            productId,
                            rating,
                            comment: review
                          })
                        });
                        if (res.ok) {
                          setSubmitted(true);
                          setTimeout(() => setSubmitted(false), 2000);
                          setRating(0);
                          setReview('');
                        } else {
                          const err = await res.json();
                          Alert.alert('Lỗi', err.error || 'Không thể gửi đánh giá');
                        }
                      } catch {
                        Alert.alert('Lỗi', 'Không thể gửi đánh giá');
                      }
                    }}
                    disabled={rating === 0 || review.trim() === ''}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                      {submitted ? 'Đã gửi!' : 'Gửi đánh giá'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {/* Hiển thị các đánh giá khác và trả lời */}
              <View style={styles.allReviewsBlock}>
                <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Đánh giá của người dùng khác:</Text>
                {reviews.length === 0 && <Text>Chưa có đánh giá nào.</Text>}
                {reviews.filter(r => r.username !== username).map(r => (
                  <ReviewItem key={r._id} review={r} username={username} onReplySuccess={() => {
                    // Reload reviews after reply
                    setSubmitted(s => !s);
                  }} />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#e91e63',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: '#007aff',
    marginBottom: 12,
    fontWeight: '500',
  },

  orderButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e53935', // đỏ
    marginTop: 10,
  },

  preorderButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#007aff', // xanh
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  status: {
    fontSize: 16,
    color: '#007aff',
    marginBottom: 12,
    fontWeight: '500',
  },

  reviewContainer: {
    marginTop: 32,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 60,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  submitReviewBtn: {
    backgroundColor: '#81c784', // xanh lá cây nhạt
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  replyBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e8f5e9',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  replySendBtn: {
    backgroundColor: '#388e3c',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  myReviewBlock: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  allReviewsBlock: {
    marginTop: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 8,
  },
  singleReview: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 6,
    marginBottom: 2,
  },
});
