const express = require('express');
const AboutController = require('../controllers/AboutController');

module.exports = (dbConnection) => {
    const router = express.Router();
    const aboutController = new AboutController(dbConnection);

    router.get('/about.json', (req, res) => aboutController.getAbout(req, res));

    return router;
};
