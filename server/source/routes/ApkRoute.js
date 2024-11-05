const express = require('express');
const ApkController = require('../controllers/ApkController');
const DownloadApk = require('../useCases/DownloadApk');

module.exports = () => {
    const router = express.Router();

    const downloadApk = new DownloadApk();
    const apkController = new ApkController(downloadApk);

    router.get('/client.apk', (req, res) => apkController.download(req, res));

    return router;
};
