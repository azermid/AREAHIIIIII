class DownloadApk {
    constructor(apkRepository) {
        this.apkRepository = apkRepository;
    }

    async getApkPath() {
        const apkPath = "/usr/src/app/shared/client.apk";
        return apkPath;
    }
}

module.exports = DownloadApk;
