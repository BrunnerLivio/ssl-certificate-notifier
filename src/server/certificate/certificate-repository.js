const db = require('../database/database');
const moment = require('moment');
const Promise = require('promise');

/**
 * This repository is for certificate operations.
 */
class CertificateRepository {
    /**
     * Formats the given date to a database-readable string
     * @param {String} date The date which should get formatted
     * @returns {String} The database-ready formatted date
     */
    _dateToDatabaseDate(date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Returns all certificates from the database
     * @returns {Promise} Promise with the result object of POSTGRES
     */
    all() {
        return db.client.query('SELECT * FROM certificate');
    }

    /**
     * Returns the certificate with the given url from the database
     * @returns {Promise} Promise with the result object of POSTGRES
     */
    getCertificateByUrl(url) {
        return db.client.query(`SELECT * FROM certificate WHERE url = $1`, [url])
    }

    /**
     * Adds the given certificate to the database
     * 
     * @typedef {Object} Certificate
     * @property {String} url The url of the certificate
     * @property {?String} expires The expiry date of the certificate
     * @property {?Number} status The status of the certificate
     * 
     * @param {Certificate} certificate The certificate to add to the database
     * @returns {Promise} Promise with the result object of POSTGRES
     */
    add(certificate) {
        let expires = certificate.expires;
        if (certificate.expires) {
            expires = this._dateToDatabaseDate(expires);
        }
        return db.client.query(`INSERT INTO certificate (url, status, expires) VALUES ($1,$2,$3)`, [certificate.url, 0, expires]);
    }

    /**
     * Updates the certificate with the given id
     * 
     * @param {Number} id The id of the certificate to update
     * @param {Certificate} certificate The certificate to add to the database
     * @returns {Promise} Promise with the result object of POSTGRES
     */
    update(id, certificate) {
        let expires = certificate.expires;
        if (certificate.expires) {
            expires = this._dateToDatabaseDate(expires);
        }
        let status = certificate.status;
        if(!certificate.status) {
            status = 0;
        }
        return db.client.query(`UPDATE certificate SET expires = $1, status = $2 WHERE id = $3;`, [expires, status, id]);
    }

    /**
     * Removes the certificate with the given url
     * 
     * @param {String} url The url of the certificate to remove from the database
     * @returns {Promise} Promise with the result object of POSTGRES
     */
    remove(url) {
        return db.client.query(`DELETE FROM certificate WHERE url = $1`, [url]);
    }

    /**
     * Adds the given certificate, if the given url is not available yet.
     * Otherwise it updates it
     * @param {Certificate} certificate The certificate to add or update
     * @returns {Promise} Promise with the result object of POSTGRES
     */
    addOrUpdate(certificate) {
        return new Promise((resolve, reject) => {
            this.getCertificateByUrl(certificate.url)
                .then((result) => {
                    // Already exists
                    if (result.rowCount > 0) {
                        // Update
                        this.update(result.rows[0].id, certificate)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        // Add 
                        this.add(certificate)
                            .then(resolve)
                            .catch(reject);
                    }
                });
        });
    }
}

module.exports = new CertificateRepository();