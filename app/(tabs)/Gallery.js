import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { height, width } = Dimensions.get('window');

export default function Gallery() {
    const { username } = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [uploading, setUploading] = useState(false);
    const flatRef = useRef(null);

    useEffect(() => {
        loadAllImages();
    }, []);

    async function loadAllImages() {
        setLoading(true);
        try {
            // 1. get all usernames
            const res = await fetch('https://ctechlab-e.io.vn/images/users/list');
            const users = await res.json();
            // 2. fetch each user's images
            const lists = await Promise.all(users.map(u => fetch(`https://ctechlab-e.io.vn/images/${encodeURIComponent(u)}`).then(r => r.json()).catch(() => null)));
            const flat = [];
            lists.forEach(l => {
                if (l && l.images) {
                    l.images.forEach(img => {
                        flat.push({ username: l.username, ...img });
                    });
                }
            });
            // sort by uploadedAt desc (if exists)
            flat.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
            setImages(flat);
        } catch (err) {
            console.error('Error loading images', err);
            Alert.alert('Lỗi', 'Không thể tải ảnh');
        }
        setLoading(false);
    }

    // Open picker and upload
    async function pickAndUpload() {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Quyền', 'Cần quyền truy cập ảnh để tải lên');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
            if (!result.assets || result.assets.length === 0) return;
            setUploading(true);

            const asset = result.assets?.[0];
            if (!asset?.uri) return;

            const localUri = asset.uri;
            const filename = localUri.split('/').pop() || `upload_${Date.now()}.jpg`;

            const extMatch = filename.match(/\.(\w+)$/);
            const ext = extMatch?.[1] || 'jpg';

            const formData = new FormData();
            formData.append('username', username);
            formData.append('image', {
                uri: Platform.OS === 'ios' ? localUri : localUri,
                name: `upload_${Date.now()}.${ext}`,
                type: `image/${ext}`,
            });

            // Send to backend (expects multipart/form-data endpoint /images/upload)
            const res = await fetch('https://ctechlab-e.io.vn/images/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            });

            if (res.ok) {
                Alert.alert('Thành công', 'Ảnh đã được tải lên');
                await loadAllImages();
            } else {
                let errMsg = 'Không thể tải ảnh lên';
                try {
                    const err = await res.json();
                    if (err?.error) errMsg = err.error;
                } catch { }
                Alert.alert('Lỗi', errMsg);

            }
        } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể tải ảnh lên');
        }
        setUploading(false);
    }

    async function handleSave(item) {
        try {
            const perm = await MediaLibrary.requestPermissionsAsync();
            if (!perm.granted) return Alert.alert('Quyền', 'Cần quyền lưu ảnh');
            const uri = item.url;
            const filename = uri.split('/').pop();
            const local = FileSystem.documentDirectory + filename;
            const dl = await FileSystem.downloadAsync(uri, local);
            const asset = await MediaLibrary.createAssetAsync(dl.uri);
            // optional: create album
            try { await MediaLibrary.createAlbumAsync('LTStore', asset, false); } catch (e) { }
            Alert.alert('Lưu xong', 'Ảnh đã được lưu vào thư viện');
        } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể lưu ảnh');
        }
        setMenuVisible(false);
    }

    async function handleDelete(item) {
        if (item.username !== username) {
            Alert.alert('Không được phép', 'Bạn chỉ có thể xóa ảnh của mình');
            return;
        }
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa ảnh này?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa', style: 'destructive', onPress: async () => {
                    try {
                        const res = await fetch(`https://ctechlab-e.io.vn/images/${encodeURIComponent(item.username)}/${encodeURIComponent(item.filename)}`, { method: 'DELETE' });
                        if (res.ok) {
                            Alert.alert('Đã xóa');
                            setImages(imgs => imgs.filter(i => !(i.username === item.username && i.filename === item.filename)));
                            setMenuVisible(false);
                        } else {
                            Alert.alert('Lỗi', 'Không thể xóa ảnh');
                        }
                    } catch (err) {
                        console.error(err);
                        Alert.alert('Lỗi', 'Không thể xóa ảnh');
                    }
                }
            }
        ]);
    }

    function openMenu(item) {
        setSelectedItem(item);
        setMenuVisible(true);
    }

    const renderItem = ({ item }) => (
        <View style={styles.page}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <TouchableOpacity style={styles.menuBtn} onPress={() => openMenu(item)}>
                <Text style={styles.menuText}>⋯</Text>
            </TouchableOpacity>
            <View style={styles.usernameBox}>
                <Text style={styles.usernameText}>{item.username}</Text>
            </View>
        </View>
    );

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#1976d2" /></View>;

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ref={flatRef}
                data={images}
                keyExtractor={(i, idx) => `${i.username}-${i.filename}-${idx}`}
                renderItem={renderItem}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={height}
                snapToAlignment="start"
                vertical
            />

            <TouchableOpacity style={styles.uploadBtn} onPress={pickAndUpload} disabled={uploading}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{uploading ? 'Đang tải...' : 'Tải ảnh lên'}</Text>
            </TouchableOpacity>

            <Modal visible={menuVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.modalRow} onPress={() => { handleSave(selectedItem); }}>
                            <Text style={styles.modalText}>Lưu ảnh</Text>
                        </TouchableOpacity>
                        {selectedItem && selectedItem.username === username && (
                            <TouchableOpacity style={styles.modalRow} onPress={() => { handleDelete(selectedItem); }}>
                                <Text style={[styles.modalText, { color: 'red' }]}>Xóa ảnh</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.modalRow} onPress={() => setMenuVisible(false)}>
                            <Text style={styles.modalText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        height,
        width,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    usernameBox: {
        position: 'absolute',
        left: 12,
        bottom: 24,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    usernameText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    menuBtn: {
        position: 'absolute',
        right: 12,
        top: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    uploadBtn: {
        position: 'absolute',
        right: 16,
        bottom: 40,
        backgroundColor: '#1976d2',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 999,
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    modalRow: { paddingVertical: 12 },
    modalText: { fontSize: 16 },
});
