const url = require('url');
const SlackController = require('../shared/slack-controller');
const APP_CONFIG = require('../../app.config.json');
const PACKAGE_JSON = require('../../../package.json');
const CertificateRepository = require('../certificate/certificate-repository');

/**
 * The controller for the Slack Bot. This controllers method should always return
 * plain text, because the Slack Bot prints the output. 
 */
class CommandsController extends SlackController {

    /**
     * Returns the most important informations about the given certificate 
     * as string.
     * @typedef {Object} Certificate
     * @property {?String} expires The expiry date of the certificate
     * @property {String} url The url of the certificate
     * @property {?Number} status The status of the certificate
     *  
     * @param {Certificate} certificate The certificate to display as string
     * 
     * @returns {String} The given certificate displayed as text with "Download ICS"-link.
     */
    _getOutputByCertificate(certificate) {
        let output = `- ${certificate.url}: `;
        switch (certificate.status) {
            case 0:
                output += 'Certificate not checked yet.';
                break;
            case 1:
                if (certificate.expires) {
                    output += `Valid until ${certificate.expires}`;
                    output += ` - <${APP_CONFIG.server.publicUrl.production}/api/certificate/${certificate.url}/ics|Download ICS> - <${APP_CONFIG.server.publicUrl.production}/api/command/remove/${certificate.url}|Remove>`;
                } else {
                    output += `Somethings wrong here. May contact the administrator?`;
                }
                break;
            case 2:
                output += 'Error occured. Is the url valid?';
                break;
        }
        return output + '\n';
    }

    /**
     * Parses the hostname of the given url
     * @param {String} rawUrl The url which should get parsed
     * @example
     * this._parseHostname('https://www.google.com'); // google.com
     * this._parseHostname('https://google.com'); // google.com
     * this._parseHostname('google.com'); // google.com
     */
    _parseHostname(rawUrl) {
        rawUrl = rawUrl.replace('www.', '');
        let parsedUrl = url.parse(rawUrl);
        let host = parsedUrl.host;
        if (parsedUrl.host === null) {
            host = parsedUrl.href;
        }
        return host;
    }

    /**
     * Removes the given url from the database
     * @param {String} rawUrl The URL to remove
     * @param {Object} res The result object of ExpressJS
     */
    remove(rawUrl, res) {
        let parsedUrl;

        try {
            parsedUrl = this._parseHostname(rawUrl);
        }
        catch (exception) {
            res.status(500).send(`Could not parse the given URL. ` + exception);
            throw exception;
        }

        return CertificateRepository
            .remove(parsedUrl)
            .then(() => res.send(`Successfully removed the url ${rawUrl}`))
            .catch((err) => this._standartErrorOutput(res, err));
    }

    /**
     * Initializes the controller
     */
    run() {
        this.url = '/api/command';
        this.post(`${this.url}/list`, (req, res) => this.list(req, res));
        this.post(`${this.url}/add`, (req, res) => this.add(req, res));
        this.post(`${this.url}/remove`, (req, res) => this.remove(req.body.text, res));
        this.get(`${this.url}/remove/:url`, (req, res) => this.remove(req.params.url, res));
        this.post(`${this.url}/help`, (req, res) => this.help(req, res));
    }

    /**
     * Lists all certificates with their expiry date and the ICS download link
     * @param {Object} req The request object of ExpressJS
     * @param {Object} res The result object of ExpressJS
     */
    list(req, res) {
        let output = 'I have the following certificates stored:\n';
        return CertificateRepository
            .all()
            .then(certificates => {
                if (certificates.rowCount) {
                    certificates.rows.forEach((certificate) => output += this._getOutputByCertificate(certificate));
                } else {
                    output = 'Nothing found! You can add URLs by typing `/sally-add [URL]`';
                }
                res.send(output);
            })
            .catch((err) => this._standartErrorOutput(res, err));
    }

    /**
     * Adds the given url to the database
     * @param {Object} req The request object of ExpressJS
     * @param {Object} res The result object of ExpressJS
     * @returns {Promise} Promise of the operation
     */
    add(req, res) {
        let rawUrl = req.body.text;
        return CertificateRepository
            .addOrUpdate({ url: this._parseHostname(rawUrl), status: 0, expires: null })
            .then(() => res.send(`Thank you for submitting ${rawUrl}. I will keep you up to date!
I can take up to 5 minutes, until I have checked your certificate. Have a coffe-break! :coffee:`))
            .catch((err) => this._standartErrorOutput(res, err));
    }

    /**
     * 
     * @param {Object} req The request object of ExpressJS
     * @param {Object} res The result object of ExpressJS
     */
    help(req, res) {
        return new Promise(resolve => {
            let help = `:dromedary_camel: Howdy! I am Sally. 
I will remind you, when a SSL-certificate expires. 
More information: ${PACKAGE_JSON.homepage}

----
*Commands*

\`/sally-help\` - Help command when you're stuck
\`/sally-list\` - List all stored URLs with their expiration date.
\`/sally-add [URL]\` - Add a URL, which you want to get reminders of. (Also internal network URLs work). (E.g. \`/sally-add google.com\`)
\`/sally-remove [URL]\` - Remove a stored url. (E.g. \`/sally-remove google.com\`)

----
*Channels*


${APP_CONFIG.channels.map(channel => `- #${channel}
`).join('')}
----
*Maintainer*
`;
            if(PACKAGE_JSON.author.name) {
                help += `Name: ${PACKAGE_JSON.author.name}
`;
            }

            if(PACKAGE_JSON.author.email) {
                help += `Email: ${PACKAGE_JSON.author.email}
`;
            }

            if(PACKAGE_JSON.author.url) {
                help += `URL: ${PACKAGE_JSON.author.url}
`;
            }

            res.send(help);
            resolve();
        });
    }
}

module.exports = CommandsController;