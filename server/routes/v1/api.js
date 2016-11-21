/**
 * @file api.js contains API routes used by the application
 * @author Miroslav Georgiev
 * @version 0.0.1
 */

'use strict';

const config = require('../../config');

module.exports = (app, express) => {
    const apiRouter = express.Router();

    /**
     * *************************************************
     * START ROUTES DEFINITIONS
     * *************************************************
     */

    // route to test the API
    apiRouter.get('/', (req, res) => res.json({ success: true, message: 'API is working!' }));

    apiRouter.route('/data').get(routeGETData);

    /**
     * *************************************************
     * END ROUTES DEFINITIONS
     * *************************************************
     */

    /**
     * *************************************************
     * START ROUTES HANDLERS/METHODS
     * *************************************************
     */

    function routeGETData(req, res, next) {
        return res.json({ success: true, message: 'data' });
    }

    /**
     * *************************************************
     * END ROUTES HANDLERS/METHODS
     * *************************************************
     */

    // return the route object
    return apiRouter;
};