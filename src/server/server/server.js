const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('promise');
const config = require('../../app.config.json');
const CommandsController = require('../commands/commands-controller');
const CertificateController = require('../certificate/certificate-controller');

/**
 * Represents the Slack Web Server
 */
class Server {
    /**
     * Initializes the controllers and 
     * configures ExpressJS
     */
    constructor() {
        this.app = express();

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        this.port = process.env.PORT || config.server.port;

        new CertificateController(this.app).run();
        new CommandsController(this.app).run();
    }

    /**
     * Runs the ExpressJS server
     * @returns {Promise} The promise when the server started
     */
    start() {
        return new Promise((resolve, reject) => {
            this.app.listen(this.port, config.server.hostname, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
}


module.exports = Server;