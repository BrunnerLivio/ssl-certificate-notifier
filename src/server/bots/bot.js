const Slackbot = require('slackbots');
const Promise = require('promise');

/**
 * Interface for a Slack Bot
 */
class Bot {
    /**
     * Initializes the Slack Bot
     * @constructor
     * @param {String} token The token of the bot 
     * @param {String} name The name of the bot
     */
    constructor(token, name) {
        this.bot = new Slackbot({ token, name });
    }

    /**
     * Initializes the Bot
     */
    $onInit() { }

    /**
     * Runs the bot. Calls '$onInit' on this bot.
     * @returns {Promise} Gets reolved when the bot started running.
     */
    run() {
        return new Promise(resolve => {
            this.bot.on('start', () => resolve());
            this.$onInit();
        });
    }
}

module.exports = Bot;