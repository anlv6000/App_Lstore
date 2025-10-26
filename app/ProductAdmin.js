import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [addingProduct, setAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        type: 'available',
        price: 0,
        scale: '',
        brand: '',
        stock: 0,
        releaseDate: '',
        description: '',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('https://ctechlab-e.io.vn/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch {
            Alert.alert('Lỗi', 'Không thể tải sản phẩm');
        }
    };

    const handleDelete = async (id) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sản phẩm này?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await fetch(`https://ctechlab-e.io.vn/products/${id}`, { method: 'DELETE' });
                        fetchProducts();
                    } catch {
                        Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
                    }
                }
            }
        ]);
    };

    const handleSave = async () => {
        try {
            await fetch(`https://ctechlab-e.io.vn/products/${editingProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct),
            });
            setEditingProduct(null);
            fetchProducts();
        } catch {
            Alert.alert('Lỗi', 'Không thể cập nhật sản phẩm');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemBox}>
            {editingProduct?._id === item._id ? (
                <>
                    <TextInput
                        value={editingProduct.name}
                        onChangeText={(text) => setEditingProduct({ ...editingProduct, name: text })}
                        style={styles.input}
                    />
                    <TextInput
                        value={String(editingProduct.price)}
                        onChangeText={(text) => setEditingProduct({ ...editingProduct, price: Number(text) })}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <View style={styles.row}>
                        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                            <Text style={{ color: '#fff' }}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEditingProduct(null)} style={styles.cancelBtn}>
                            <Text>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setEditingProduct(item)} style={styles.editBtn}>
                            <Text style={{ color: '#1976d2' }}>Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                            <Text style={{ color: '#e53935' }}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý sản phẩm</Text>
            <TouchableOpacity
                style={{
                    backgroundColor: '#1976d2',
                    padding: 10,
                    borderRadius: 6,
                    marginBottom: 16,
                    alignItems: 'center',
                }}
                onPress={() => setAddingProduct(true)}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Thêm sản phẩm</Text>
            </TouchableOpacity>
            {addingProduct && (
                <View style={styles.itemBox}>
                    <TextInput
                        placeholder="Tên sản phẩm"
                        value={newProduct.name}
                        onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Loại (available hoặc preorder)"
                        value={newProduct.type}
                        onChangeText={(text) => setNewProduct({ ...newProduct, type: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Giá"
                        value={String(newProduct.price)}
                        onChangeText={(text) => setNewProduct({ ...newProduct, price: Number(text) })}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TextInput
                        placeholder="Thương hiệu"
                        value={newProduct.brand}
                        onChangeText={(text) => setNewProduct({ ...newProduct, brand: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Tồn kho"
                        value={String(newProduct.stock)}
                        onChangeText={(text) => setNewProduct({ ...newProduct, stock: Number(text) })}
                        style={styles.input}
                        keyboardType="numeric"
                    />

                    {/* Nhập 4 ảnh */}
                    {[0, 1, 2, 3].map((i) => (
                        <TextInput
                            key={i}
                            placeholder={`Ảnh ${i + 1} - URL`}
                            value={newProduct.images?.[i] || ''}
                            onChangeText={(text) => {
                                const updatedImages = [...(newProduct.images || [])];
                                updatedImages[i] = text;
                                setNewProduct({ ...newProduct, images: updatedImages });
                            }}
                            style={styles.input}
                        />
                    ))}

                    <View style={styles.row}>
                        <TouchableOpacity
                            onPress={async () => {
                                const payload = {
                                    ...newProduct,
                                    releaseDate: new Date().toISOString(), // thời gian hiện tại
                                    images: newProduct.images?.filter((url) => url?.trim()) || [],
                                };
                                try {
                                    const res = await fetch('https://ctechlab-e.io.vn/products', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload),
                                    });
                                    if (res.ok) {
                                        Alert.alert('Thành công', 'Đã thêm sản phẩm');
                                        setAddingProduct(false);
                                        setNewProduct({
                                            name: '',
                                            type: 'available',
                                            price: 0,
                                            brand: '',
                                            stock: 0,
                                            images: [],
                                        });
                                        fetchProducts();
                                    } else {
                                        Alert.alert('Lỗi', 'Không thể thêm sản phẩm');
                                    }
                                } catch {
                                    Alert.alert('Lỗi', 'Không thể thêm sản phẩm');
                                }
                            }}
                            style={styles.saveBtn}
                        >
                            <Text style={{ color: '#fff' }}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setAddingProduct(false)} style={styles.cancelBtn}>
                            <Text>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    itemBox: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    name: { fontSize: 16, fontWeight: 'bold' },
    price: { marginBottom: 8 },
    row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
    editBtn: { marginRight: 12 },
    deleteBtn: {},
    saveBtn: {
        backgroundColor: '#1976d2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginRight: 12,
    },
    cancelBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#eee',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
    },
});
