const AboutUseCase = require('../useCases/About');

class AboutController {
    constructor(dbConnection) {
        this.aboutUseCase = new AboutUseCase(dbConnection);
    }

    async getAbout(req, res) {
        try {
            const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const aboutData = await this.aboutUseCase.execute(clientIp);
            res.json(aboutData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch about data: ' + error.message });
        }
    }
}

module.exports = AboutController;
