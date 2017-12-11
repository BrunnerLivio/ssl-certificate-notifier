const request = require('request');
const config = require('../app.config.json');
const async = require('async');
const chalk  = require('chalk');
const checker = require('./checker');


/**
 * Returns the server url, depending on the NODE_ENV environment variable
 * @returns {String} The server url
 */
function getServerUrl() {
    const apiPath = '/api/certificate';
    if (process.env.NODE_ENV === 'production') {
        return `${config.server.publicUrl.production}${apiPath}`;
    } else {
        return `${config.server.publicUrl.dev}${apiPath}`;
    }
}

/**
 * Updates each certificate from the given lists 
 * in the Web API.
 * @param {Object} err Error
 * @param {Object[]} results List of certificates
 */
function updateEachCertificate(err, results) {
    results.forEach((certificate) => {
        request({
            url: getServerUrl(),
            method: 'POST',
            json: certificate
        });
    });
}

console.log(`${chalk.blue('i')} Checking certificates from ${chalk.cyan(getServerUrl())}`);

request(getServerUrl(), (error, response, body) => {
    const certificates = JSON.parse(body);
    async.map(certificates, (certificate, callback) =>
        checker(certificate)
            .then(certificate => {
                console.log(`${chalk.green('✓')} ${chalk.cyan(certificate.url)} is valid until ${chalk.cyan(certificate.expires)}`);
                return callback(null, certificate);
            })
            .catch(err => {
                console.log(`${chalk.red('✗')} ${chalk.cyan(certificate.url)} not found any certificate`, err)
                return callback(null, certificate);
            })
        , updateEachCertificate);
});
