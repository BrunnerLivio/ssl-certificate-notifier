const shouldRemindToday = require('../reminder/reminder-checker');
const REMINDER_TYPE = require('../reminder/reminder-types');
const config = require('../../app.config.json');
const Bot = require('./bot');
const CertificateRepository = require('../certificate/certificate-repository');

/**
 * Controls the Slack Bot named "Sally"
 */
class Sally extends Bot {
    /**
     * Initializes the bot with the `app.config.json` settings
     */
    constructor() {
        super(config.bots.sally.token, config.bots.sally.name);
    }

    /**
     * Initializes the bot. Sends reminders, if possible.
     */
    $onInit() {
        this.sendReminders();
    }

    /**
     * Sends a reminder of the given certificate
     * 
     * @typedef {Object} Reminder
     * @property {Number} type The type of the reminder; either FRIENDLY (0) or UNFRIENDLY (1)
     * @property {Number} daysLeft How many days are left until the given date occurs
     * 
     * @typedef {Object} Certificate
     * @property {String} url The url of the certificate
     * @property {String} expires The expiry date of the certificate
     * @property {Number} status The status of the certificate
     * 
     * @param {Reminder} reminder The reminder object which holds the information when it expires
     * @param {Certificate} certificate The certificate which the reminder should be sent
     */
    sendReminder(reminder, certificate) {
        let expiringMessage =
            `The SSL certificate for *${certificate.url}*`
            + ` is expiring in *${reminder.daysLeft} day${reminder.daysLeft === 1 ? '' : 's'}* at ${certificate.expires}.`;

        switch (reminder.type) {
            case REMINDER_TYPE.FRIENDLY:
                this.send(`${expiringMessage}
This is a friendly reminder. You still have enough time :smile:`);
                break;
            case REMINDER_TYPE.UNFRIENDLY:
                this.send(`${expiringMessage}
This is a "not-so-friendly" reminder. You really should update this certificate!
SSL Alpaca is not happy! :rage:`, true);
                break;
        }
    }

    /**
     * Sends reminders to all possible certificates
     */
    sendReminders() {
        this.list()
            .then(certificates => {
                certificates.forEach(certificate => {
                    let reminder = shouldRemindToday(new Date(certificate.expires));
                    if (reminder) {
                        this.sendReminder(reminder, certificate);
                    }
                });
            });
    }

    /**
     * Returns a list of certificates
     * @returns {Promise} Promise with the result object of POSTGRES
     */
    list() {
        return CertificateRepository.all();
    }

    /**
     * Sends a message as Sally bot to all configured channels in app.config.json. Either angry message or not angry message. 
     * The icon changes depending if Sally is angry or not. The icons can be configured
     * in the app.config.json
     * @param {String} message The message to send
     * @param {Boolean} angry If Sally is angry
     */
    send(message, angry = false) {
        config.channels.forEach(channel =>
            this.bot.postMessageToChannel(channel, message,
                {
                    slackbot: true,
                    icon_url: angry ? config.bots.sally.icon.angry : config.bots.sally.icon.happy
                }, () => console.log(`Sally sent a message to channel "${channel}": ${message}`)));
    }
}

module.exports = Sally;