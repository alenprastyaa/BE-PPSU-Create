// controllers/pekerjaan.controller.js
const Pekerjaan = require('../models/pekerjaan.model');
const upload = require('../uploads/upload.js'); // Use centralized upload
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink); // Menggunakan promisify untuk unlink


// Create new pekerjaan
exports.create = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => (err ? reject(err) : resolve()));
        });

        if (!req.body.nama_petugas || !req.body.nama_team) {
            throw new Error('Missing required fields: nama_petugas or nama_team');
        }

        // Folder tujuan untuk gambar yang dikompresi
        const compressedDir = 'uploads/';
        if (!fs.existsSync(compressedDir)) {
            fs.mkdirSync(compressedDir, { recursive: true });
        }

        // Proses gambar kondisi lapangan
        let kondisiLapanganImage = null;
        if (req.files['kondisi_lapangan_image']) {
            const originalPath = req.files['kondisi_lapangan_image'][0].path;
            const compressedPath = path.join(
                compressedDir,
                `compressed_${Date.now()}_${req.files['kondisi_lapangan_image'][0].originalname}`
            );

            await sharp(originalPath)
                .resize(800) // Resize gambar (contoh: max width 800px)
                .jpeg({ quality: 50 }) // Kompresi gambar, kualitas 50%
                .toFile(compressedPath);

            fs.unlinkSync(originalPath); // Hapus file asli (opsional)
            kondisiLapanganImage = path.basename(compressedPath); // Simpan nama file
        }

        // Proses gambar progres pekerjaan
        let progresPekerjaanImage = null;
        if (req.files['progres_pekerjaan_image']) {
            const originalPath = req.files['progres_pekerjaan_image'][0].path;
            const compressedPath = path.join(
                compressedDir,
                `compressed_${Date.now()}_${req.files['progres_pekerjaan_image'][0].originalname}`
            );

            await sharp(originalPath)
                .resize(800)
                .jpeg({ quality: 50 })
                .toFile(compressedPath);

            fs.unlinkSync(originalPath);
            progresPekerjaanImage = path.basename(compressedPath);
        }

        const newPekerjaan = {
            nama_petugas: req.body.nama_petugas,
            nama_team: req.body.nama_team,
            tanggal: req.body.tanggal,
            sumber_informasi: req.body.sumber_informasi,
            kondisi_lapangan_image: kondisiLapanganImage,
            keterangan_kondisi_lapangan: req.body.keterangan_kondisi_lapangan,
            lokasi_pekerjaan: req.body.lokasi_pekerjaan,
            progres_pekerjaan_image: progresPekerjaanImage,
            keterangan_pekerjaan: req.body.keterangan_pekerjaan,
        };

        const data = await Pekerjaan.create(newPekerjaan);
        res.status(201).send(data);
    } catch (err) {
        console.error('Error creating pekerjaan:', err);
        res.status(500).send({ message: err.message || 'Error creating pekerjaan.' });
    }
};

// Other functions (update, findAll, findOne, delete)...


// Update pekerjaan by ID
exports.update = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => (err ? reject(err) : resolve()));
        });

        const pekerjaan = {
            nama_petugas: req.body.nama_petugas,
            nama_team: req.body.nama_team,
            tanggal: req.body.tanggal,
            sumber_informasi: req.body.sumber_informasi,
            kondisi_lapangan_image: req.files['kondisi_lapangan_image']
                ? req.files['kondisi_lapangan_image'][0].filename
                : req.body.kondisi_lapangan_image,
            keterangan_kondisi_lapangan: req.body.keterangan_kondisi_lapangan,
            lokasi_pekerjaan: req.body.lokasi_pekerjaan,
            progres_pekerjaan_image: req.files['progres_pekerjaan_image']
                ? req.files['progres_pekerjaan_image'][0].filename
                : req.body.progres_pekerjaan_image,
            keterangan_pekerjaan: req.body.keterangan_pekerjaan
        };

        const data = await Pekerjaan.updateById(req.params.id, pekerjaan);
        res.send(data);
    } catch (err) {
        const status = err.kind === 'not_found' ? 404 : 500;
        res.status(status).send({ message: err.message || 'Error updating pekerjaan.' });
    }
};

// Get all pekerjaan
exports.findAll = async (req, res) => {
    try {
        const data = await Pekerjaan.getAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error retrieving pekerjaan.' });
    }
};

// Get pekerjaan by ID
exports.findOne = async (req, res) => {
    try {
        const data = await Pekerjaan.findById(req.params.id);
        res.send(data);
    } catch (err) {
        const status = err.kind === 'not_found' ? 404 : 500;
        res.status(status).send({ message: err.message || 'Error retrieving pekerjaan.' });
    }
};

// Delete pekerjaan by ID
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        // Periksa apakah pekerjaan dengan ID tersebut ada
        const pekerjaan = await Pekerjaan.findById(id);
        if (!pekerjaan) {
            return res.status(404).send({ message: `Pekerjaan dengan ID ${id} tidak ditemukan.` });
        }

        // Hapus pekerjaan dari database
        await Pekerjaan.deleteById(id);

        // Hapus file terkait jika ada
        try {
            // Hapus gambar kondisi lapangan
            if (pekerjaan.kondisi_lapangan_image) {
                const kondisiFilePath = path.join('uploads', pekerjaan.kondisi_lapangan_image);
                try {
                    await unlinkAsync(kondisiFilePath); // Asynchronous unlink
                    console.log(`File kondisi lapangan ${kondisiFilePath} telah dihapus.`);
                } catch (fileErr) {
                    console.error('Error deleting kondisi lapangan image:', fileErr);
                }
            }

            // Hapus gambar progres pekerjaan
            if (pekerjaan.progres_pekerjaan_image) {
                const progresFilePath = path.join('uploads', pekerjaan.progres_pekerjaan_image);
                try {
                    await unlinkAsync(progresFilePath); // Asynchronous unlink
                    console.log(`File progres pekerjaan ${progresFilePath} telah dihapus.`);
                } catch (fileErr) {
                    console.error('Error deleting progres pekerjaan image:', fileErr);
                }
            }
        } catch (err) {
            console.error('Error during file deletion:', err);
            return res.status(500).send({ message: 'Terjadi kesalahan saat menghapus file terkait pekerjaan.' });
        }

        // Response sukses
        res.send({ message: `Pekerjaan dengan ID ${id} berhasil dihapus.` });
    } catch (err) {
        console.error('Error deleting pekerjaan:', err);
        const status = err.message.includes('not found') ? 404 : 500;
        res.status(status).send({ message: err.message || 'Terjadi kesalahan saat menghapus pekerjaan.' });
    }
};
