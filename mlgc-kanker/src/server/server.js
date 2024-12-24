require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080, 
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        }, 
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;
        if (response instanceof Error) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();
