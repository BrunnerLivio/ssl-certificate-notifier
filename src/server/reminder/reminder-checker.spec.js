require('./reminder-checker');
const mock = require('mock-require');
const { assert } = require('chai');

describe('reminder-checker', () => {
    let today;
    let shouldRemindToday;

    beforeEach(() => {
        mock('./reminder-types', {
            FRIENDLY: 0,
            UNFRIENDLY: 1
        });
    
        mock('../../app.config.json', {
            'reminders': {
                'friendly': [
                    '30',
                    '14'
                ],
                'unfriendly': [
                    '7',
                    '2',
                    '1',
                    '0'
                ],
                'checkTime': '12'
            }
        });

        today = new Date();
        shouldRemindToday = mock.reRequire('./reminder-checker');
    });

    it('should not remind 15 days before', () => {
        const inFifteenDays = new Date();
        inFifteenDays.setDate(today.getDate() + 15);

        const reminder = shouldRemindToday(inFifteenDays);
        assert.isUndefined(reminder, 'Reminder is undefined');
    });

    it('should unfriendly remind 1 day before', () => {
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const reminder = shouldRemindToday(tomorrow);
        assert.deepEqual(reminder, { type: 1, daysLeft: 1 });
    });

    it('should friendly remind 14 days before', () => {
        const inFourteenDays = new Date();
        inFourteenDays.setDate(today.getDate() + 14);

        const reminder = shouldRemindToday(inFourteenDays);
        assert.deepEqual(reminder, { type: 0, daysLeft: 14 });
    });
});
