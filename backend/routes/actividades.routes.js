const express = require('express');
const router = express.Router();

// Ruta ejemplo para actividades
router.get('/', (req, res) => {
    res.json({ msg: 'Ruta de actividades' });
});

module.exports = router;