const express = require('express');
const router = express.Router();
const pekerjaanController = require('../controllers/pekerjaan.controller');

router.post('/kerja', pekerjaanController.create);
router.get('/kerja', pekerjaanController.findAll);
router.get('/kerja:id', pekerjaanController.findOne);
router.put('/kerja:id', pekerjaanController.update);
router.delete('/kerja/:id', pekerjaanController.delete);

module.exports = router;
