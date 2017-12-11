const Controller = require('./controller');
const chalk = require('chalk');

/**
 * Represent an ExpressJS controller for Slack
 */
class SlackController extends Controller {
    
    /**
     * Logs the operations
     * @param {String} operation The URL operation
     * @param {Object} req The request object from ExpressJS
     * @param {String} method The HTTP-Method
     * 
     * @example
     * this._logOperation('/api/command/add', req, 'POST');
     * 
     */
    _logOperation(operation, req, method) {
        const chalkedMethod = this._getChalkedMethod(method);
        console.log(chalk.default`
{cyan Slack:} User {cyan ${req.body.user_name}} from channel {cyan ${req.body.channel_name}} requested ${chalkedMethod} {cyan ${operation}} with content "{cyan ${req.body.text}}"`);
    }

    /**
     * Logs the error
     * @param {String} operation The URL operation
     * @param {String} method The HTTP-Method
     * @param {Error} err The error object
     * @param {Object} req The request object from ExpressJS
     * 
     * @example
     * this._logError('/api/command/add', 'POST', err, req);
     * 
     */
    _logError(operation, method, err, req) {
        const chalkedMethod = this._getChalkedMethod(method);
        console.log(chalk.default`
{cyan Slack:} {red ERROR} User {cyan ${req.body.user_name}} from channel {cyan ${req.body.channel_name}} requested ${chalkedMethod} {cyan ${operation}} with content "{cyan ${req.body.text}}"
{red ERROR MESSAGE}: ${err.message}
{red ERROR STACK}: ${err.stack}
{red REQUEST BODY}: ${JSON.stringify(req.body)}`);
    }
}

module.exports = SlackController;