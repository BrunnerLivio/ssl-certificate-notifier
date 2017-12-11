const ics = require('ics');
const Promise = require('promise');

/**
 * Generates an ICS string 
 * @param {Object} certificate The certificate from the database to generate the ICS string from
 * @param {String} certificate.url The certificate url
 * @param {String} certificate.expires The certificate expiry date
 * @returns {Promise} Returns the promise of the ICS event
 */
function getICSByCertificate(certificate) {
    return new Promise((resolve, reject) => {
        const expiryDate = new Date(certificate.expires);
        ics.createEvent({
            title: `${certificate.url} SSL certificate expires`,
            start: [
                expiryDate.getFullYear(),
                expiryDate.getMonth() + 1,
                expiryDate.getDate(),
                expiryDate.getHours(),
                expiryDate.getMinutes()
            ],
            duration: { seconds: 1 },
            alarms: [{
                // Add alarm 1 month ago
                action: 'display',
                trigger: [
                    expiryDate.getFullYear(),
                    expiryDate.getMonth(),
                    expiryDate.getDate(),
                    expiryDate.getHours(),
                    expiryDate.getMinutes()
                ]
            }]
        }, (error, value) => {
            if(error) {
                reject(error);
            }
            resolve(value);
        });
    });
}

module.exports = getICSByCertificate;