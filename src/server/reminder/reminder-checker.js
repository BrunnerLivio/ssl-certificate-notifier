const config = require('../../app.config.json');
const REMINDER_TYPE = require('./reminder-types');

/**
 * Returns if it should remind the given date.
 * The reminder dates are configured in the app.config.json
 * @param {Date} date The date of which the final date is. 
 * 
 * @typedef {Object} Reminder
 * @property {Number} type The type of the reminder; either FRIENDLY (0) or UNFRIENDLY (1)
 * @property {Number} daysLeft How many days are left until the given date occurs
 *
 * @returns {Reminder} The reminder object which inclus when and how the reminder is
 */
function shouldRemindToday(date) {
    const today = new Date().setHours(0, 0, 0, 0);
    let reminder;
    Object.keys(REMINDER_TYPE).forEach(reminderType => {
        // Goes through each type of reminder
        // E.g. friendly / unfriendly
        config
            .reminders[reminderType.toLocaleLowerCase()]
            .forEach(reminderDays => {
                // Checks if in the config any reminder
                // date is today.
                const dateToRemind = new Date(date.setHours(0, 0, 0, 0));
                const dateToRemindNumber = dateToRemind.setDate(dateToRemind.getDate() - parseInt(reminderDays));
                if (dateToRemindNumber === today) {
                    reminder = {
                        type: REMINDER_TYPE[reminderType],
                        daysLeft: parseInt(reminderDays)
                    };
                }
            });
    });
    return reminder;
}

module.exports = shouldRemindToday;