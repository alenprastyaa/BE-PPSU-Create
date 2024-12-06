const db = require('../config/db.config'); // Pool connection sudah digunakan

const Pekerjaan = function (pekerjaan) {
    this.nama_petugas = pekerjaan.nama_petugas;
    this.nama_team = pekerjaan.nama_team;
    this.tanggal = pekerjaan.tanggal;
    this.sumber_informasi = pekerjaan.sumber_informasi;
    this.kondisi_lapangan_image = pekerjaan.kondisi_lapangan_image;
    this.keterangan_kondisi_lapangan = pekerjaan.keterangan_kondisi_lapangan;
    this.lokasi_pekerjaan = pekerjaan.lokasi_pekerjaan;
    this.progres_pekerjaan_image = pekerjaan.progres_pekerjaan_image;
    this.keterangan_pekerjaan = pekerjaan.keterangan_pekerjaan;
};

// Create
Pekerjaan.create = async (newPekerjaan) => {
    const query = "INSERT INTO pekerjaan SET ?";
    try {
        const [res] = await db.query(query, newPekerjaan);
        return { id: res.insertId, ...newPekerjaan };
    } catch (err) {
        console.error('Error creating pekerjaan:', err.message);
        throw err;
    }
};

// Get All with Pagination
Pekerjaan.getAll = async (limit, offset) => {
    let query = "SELECT * FROM pekerjaan";
    const params = [];

    if (limit !== undefined && offset !== undefined) {
        query += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
    }

    try {
        const [rows] = await db.query(query, params);
        return rows;
    } catch (err) {
        console.error('Error fetching pekerjaan:', err.message);
        throw err;
    }
};

// Get by ID
Pekerjaan.findById = async (id) => {
    const query = "SELECT * FROM pekerjaan WHERE id = ?";
    try {
        const [rows] = await db.query(query, [id]);
        if (rows.length) return rows[0];
        throw new Error('Pekerjaan not found');
    } catch (err) {
        console.error('Error finding pekerjaan:', err.message);
        throw err;
    }
};

// Update by ID
Pekerjaan.updateById = async (id, pekerjaan) => {
    const query = `
        UPDATE pekerjaan 
        SET nama_petugas = ?, nama_team = ?, tanggal = ?, 
            sumber_informasi = ?, kondisi_lapangan_image = ?, 
            keterangan_kondisi_lapangan = ?, lokasi_pekerjaan = ?, 
            progres_pekerjaan_image = ?, keterangan_pekerjaan = ? 
        WHERE id = ?
    `;
    const values = [
        pekerjaan.nama_petugas, pekerjaan.nama_team, pekerjaan.tanggal,
        pekerjaan.sumber_informasi, pekerjaan.kondisi_lapangan_image,
        pekerjaan.keterangan_kondisi_lapangan, pekerjaan.lokasi_pekerjaan,
        pekerjaan.progres_pekerjaan_image, pekerjaan.keterangan_pekerjaan, id
    ];
    try {
        const [res] = await db.query(query, values);
        if (res.affectedRows === 0) throw new Error('Pekerjaan not found');
        return { id: id, ...pekerjaan };
    } catch (err) {
        console.error('Error updating pekerjaan:', err.message);
        throw err;
    }
};

// Delete by ID
Pekerjaan.deleteById = async (id) => {
    const query = "DELETE FROM pekerjaan WHERE id = ?";
    try {
        const [res] = await db.query(query, [id]);
        if (res.affectedRows === 0) throw new Error('Pekerjaan not found');
        return { message: `Pekerjaan with ID ${id} deleted successfully` };
    } catch (err) {
        console.error('Error deleting pekerjaan:', err.message);
        throw err;
    }
};

module.exports = Pekerjaan;
