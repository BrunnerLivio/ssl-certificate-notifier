const sslChecker = require('ssl-checker');

/**
 * Checks the expiration date of the given certificate
 * 
 * @typedef {Object} Certificate
 * @property {String} url The url of the certificate
 * @property {String} expires The expiry date of the certificate
 * @property {Number} status The status of the certificate
 * 
 * @param {Certificate} certificate The certificate to check the expiry date
 * 
 * @returns {Promise} Promise with the certificate
 */
function checker(certificate) {

    return new Promise((resolve, reject) => {
        let found = false;
        setTimeout(() => {
            if (!found) {
                reject(new Error('Certificate not found after 5 seconds. Timeout'))
            }
        }, 5000);
        sslChecker(certificate.url, 'GET', 443)
            .then(result => {
                found = true;
                if (result) {
                    certificate.expires = result.valid_to;
                    certificate.status = 1;
                    resolve(certificate);
                } else {
                    certificate.status = 2;
                    reject(certificate);
                }
            })
            .catch(() => {
                certificate.status = 2;
                reject(certificate);
            });
    });
}

module.exports = checker;