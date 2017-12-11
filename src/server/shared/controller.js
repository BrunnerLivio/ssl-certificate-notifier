const chalk = require('chalk');

/**
 * Represent an ExpressJS controller
 */
class Controller {
    /**
     * Sets the app instance as a private property
     * @param {Object} app The ExpressJS "app"-instance
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * Sends a 500 result, prints the message and throws the error
     * @param {Object} res The ExpressJS res object
     * @param {Error} err The error to print
     */
    _standartErrorOutput(res, err) {
        res.status(500).send(err.message);
        throw err;
    }

    /**
     * Returns the IP of the req object
     * @param {Object} req The ExpressJS req object
     */
    _getRequestIp(req) {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }

    /**
     * Returns the given HTTP-method in color
     * @param {String} method The method to colorize
     * @returns {String} The given HTTP-method in color using chalk
     */
    _getChalkedMethod(method) {
        switch(method) {
            case 'POST':
                return chalk.default.blue(method);
            case 'GET':
                return chalk.default.green(method);
            case 'DELETE':
                return chalk.default.redBright(method);
        }
    }

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
{magenta API:} {cyan ${this._getRequestIp(req)}} requested ${chalkedMethod} {cyan ${operation}} with content {cyan ${JSON.stringify(req.body)}}`);
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
{magenta API:} {red ERROR} {cyan ${this._getRequestIp(req)}} requested ${chalkedMethod} {cyan ${operation}} with content {cyan ${JSON.stringify(req.body)}}"
{red ERROR MESSAGE}: ${err.message}
{red ERROR STACK}: ${err.stack}
{red REQUEST BODY}: ${JSON.stringify(req.body)}`);
    }

    /**
     * Adds a POST-route
     * @param {String} url The url of the route 
     * @param {function(Object, Object): Promise} callback The callback
     * @example
     * this.post(`/api/command/list`, (req, res) => this.list(req, res));
     */
    post(url, callback) {
        this.app.post(url, (req, res) => {
            try {
                return callback(req, res)
                    .then(() => this._logOperation(url, req, 'POST'))
                    .catch(err => this._logError(url, 'POST', err, req));
            } catch(err) {
                this._logError(url, 'POST', err, req);
            }
        });
    }

    /**
     * Adds a GET-route
     * @param {String} url The url of the route 
     * @param {Function} callback The callback
     * @example
     * this.get(`/api/command/list`, (req, res) => this.list(req, res));
     */
    get(url, callback) {
        this.app.get(url, (req, res) => {
            try {
                return callback(req, res)
                    .then(() => this._logOperation(url, req, 'GET'))
                    .catch(err => this._logError(url, 'GET', err, req));
            } catch(err) {
                this._logError(url, 'GET', err, req);
            }
        });
    }

    /**
     * Adds a DELETE-route
     * @param {String} url The url of the route 
     * @param {Function} callback The callback
     * @example
     * this.get(`/api/command/list`, (req, res) => this.list(req, res));
     */
    delete(url, callback) {
        this.app.delete(url, (req, res) => {
            try {
                return callback(req, res)
                    .then(() => this._logOperation(url, req, 'DELETE'))
                    .catch(err => this._logError(url, 'DELETE', err, req));
            } catch(err) {
                this._logError(url, 'DELETE', err, req);
            }
        });
    }
}

module.exports = Controller; 