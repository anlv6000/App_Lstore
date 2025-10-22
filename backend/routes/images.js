const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Lấy toàn bộ ảnh của một người dùng
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const userImages = await Image.findOne({ username });
        res.json(userImages || { username, images: [] });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy ảnh người dùng' });
    }
});

// ✅ Thêm ảnh mới vào mảng images[]
router.post('/', async (req, res) => {
    try {
        const { username, image } = req.body;

        if (!username || !image || !image.url || !image.filename) {
            return res.status(400).json({ error: 'Thiếu thông tin ảnh' });
        }

        const updated = await Image.findOneAndUpdate(
            { username },
            {
                $push: { images: { ...image, uploadedAt: new Date() } },
                $set: { updatedAt: new Date() },
                $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true, new: true }
        );

        res.status(201).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm ảnh' });
    }
});

// ✅ Lấy danh sách tất cả username đã từng upload ảnh
router.get('/users/list', async (req, res) => {
    try {
        const usernames = await Image.distinct('username');
        res.json(usernames);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
    }
});

// ✅ Xóa ảnh cụ thể theo filename
router.delete('/:username/:filename', async (req, res) => {
    try {
        const { username, filename } = req.params;

        const updated = await Image.findOneAndUpdate(
            { username },
            { $pull: { images: { filename } }, $set: { updatedAt: new Date() } },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa ảnh' });
    }
});

// ✅ (Tuỳ chọn) Cập nhật thông tin ảnh (ví dụ đổi tên, tag...)
router.put('/:username/:filename', async (req, res) => {
    try {
        const { username, filename } = req.params;
        const updateFields = req.body;

        const updated = await Image.findOneAndUpdate(
            { username, 'images.filename': filename },
            {
                $set: {
                    'images.$': {
                        ...updateFields,
                        filename,
                        uploadedAt: new Date()
                    },
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi cập nhật ảnh' });
    }
});
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const username = req.body.username;
        const file = req.file;

        if (!username || !file) {
            return res.status(400).json({ error: 'Thiếu thông tin ảnh hoặc username' });
        }

        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `img_${Date.now()}.webp`;
        const outputPath = path.join(__dirname, '../uploads', username);

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        await sharp(file.buffer)
            .toFormat('webp', { quality: 70 })
            .toFile(`${outputPath}/${filename}`);

        const imageUrl = `https://ctechlab-e.io.vn/image/uploads/${username}/${filename}`;

        // Lưu metadata vào MongoDB
        const imageMeta = {
            filename,
            url: imageUrl,
            format: 'webp',
            sizeKB: file.size / 1024,
            resolution: '1280x720',
            uploadedAt: new Date()
        };

        const updated = await Image.findOneAndUpdate(
            { username },
            {
                $push: { images: imageMeta },
                $set: { updatedAt: new Date() },
                $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ success: true, image: imageMeta });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Lỗi khi xử lý ảnh' });
    }
});
module.exports = router;
