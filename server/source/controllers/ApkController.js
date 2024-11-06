class ApkController {
    constructor(downloadApk) {
        this.downloadApk = downloadApk;
    }

    async download(req, res) {
        try {
            const apkPath = await this.downloadApk.getApkPath();
            res.download(apkPath, 'client.apk', (err) => {
                if (err) {
                    res.status(500).json({ error: 'Could not download the APK: ', err });
                }
            });
            res.status(200);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ApkController;
