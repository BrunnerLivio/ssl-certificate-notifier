const Server = require('./server/server');
const Sally = require('./bots/sally');
const config = require('../app.config.json');
const db = require('./database/database');


const sally = new Sally();
const server = new Server();

db.run().then(() => {
    setInterval(() => {
        // Sets up the Slack Bot reminder
        let now = new Date();
        let checkTime = parseInt(config.reminders.checkTime);
        if (checkTime === now.getHours()) {
            sally.run();
        }
        // Check every hour
    }, 3600000);
    server.start()
});