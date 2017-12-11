const Controller = require('../shared/controller');
const CertificateRepository = require('./certificate-repository');
const getICSFromCertificate = require('../reminder/get-ics-from-certificate');
const checker = require('../../checker/checker');

/**
 * The controller is an interface for the checker-application and for
 * 3rd party applications. This controller is mainly for certificate operations
 */
class CertificateController extends Controller {

    /**
     * Adds or updates the given certificate and returns a url status.
     * @param {Certificate} certificate The certificate to add or update in the DB
     * @param {Object} res The result object of ExpressJS
     */
    _addCertificate(certificate, res) {
        return CertificateRepository
            .addOrUpdate(certificate)
            .then(() => res.sendStatus(200))
            .catch(err => {
                res.sendStatus(500);
                throw err;
            });
    }

    /**
     * Initializes the controller
     */
    run() {
        this.url = '/api/certificate';
        this.get(this.url, (req, res) => this.all(req, res));
        this.post(this.url, (req, res) => this.add(req, res));
        this.delete(this.url, (req, res) => this.remove(req, res));
        this.get(`${this.url}/:url/ics`, (req, res) => this.getICS(req, res));
    }

    /**
     * Lists all certificates
     * @param {Object} req The request object of ExpressJS
     * @param {Object} res The result object of ExpressJS
     */
    all(req, res) {
        return CertificateRepository
            .all()
            .then(certificates => res.send(certificates.rows))
            .catch(err => {
                res.sendStatus(500);
                throw err;
            });
    }

    /**
     * Removes the certificate with the given url
     * @param {Object} req The request object of ExpressJS
     * @param {Object} res The result object of ExpressJS
     */
    remove(req, res) {
        return CertificateRepository
            .remove(req.body.url)
            .then(() => res.sendStatus(200))
            .catch(err => this._standartErrorOutput(res, err));
    }

    /**
     * Adds or updates the certificate with the given url.
     * Checks the expiry date.
     * @param {Object} req The request object of ExpressJS
     * @param {Object} res The result object of ExpressJS
     */
    add(req, res) {
        let url = req.body.url;
        let expires = req.body.expires;
        let status = req.body.status;

        const certificate = { expires, url, status };
        if (certificate.url) {
            certificate.url = certificate.url.trim();
        } else {
            return res.sendStatus(500);
        }

        if (certificate.expires) {
            certificate.expires = new Date(certificate.expires);
            return this._addCertificate(certificate, res);
        } else {
            return checker(certificate).then(checkedCertificate => {
                if (checkedCertificate.expires) {
                    checkedCertificate.expires = new Date(checkedCertificate.expires);
                    return this._addCertificate(checkedCertificate, res);
                } else {
                    return this._addCertificate(certificate, res);
                }
            })
            .catch(err => this._standartErrorOutput(res, err));
        }
    }

    /**
     * Returns a ICS download link from the given certificate url.
     * @param {Object} req The request object of ExpressJS
     * @param {Object} res The result object of ExpressJS
     */
    getICS(req, res) {
        return CertificateRepository
            .getCertificateByUrl(req.params.url)
            .then(result => {
                if (result.rowCount > 0 && result.rows[0].url) {
                    getICSFromCertificate(result.rows[0])
                        .then((ics) => {
                            res.set('Content-Type', 'text/calendar');
                            res.send(ics);
                        })
                        .catch(err => {
                            throw err;
                        });
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(err => this._standartErrorOutput(res, err));
    }
}

module.exports = CertificateController; 