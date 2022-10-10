const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const jwt = require('jsonwebtoken');
const Boom = require('boom');
const _ = require('lodash');
const Joi = require('joi');

(async () => {
  const server = await new Hapi.Server({
    host: 'localhost',
    port: 3001,
    routes: {
      cors: {
        origin: ['*'],
        headers: [
          "Content-Type",
          "Authorization",
          "Access-Control-Allow-Methods",
          "Access-Control-Request-Headers"
        ],
        credentials: true
      },
    }
  });

   
  const Routes = require('./routes');
  for (var route in Routes) {
      const r = Routes[route]
      server.route(r);
  }

  // const validate = credentials => {
  //   return { isValid: users.readUsers().find(user => user.id == [credentials.id]) ? true : false }
  // };

  const swaggerOptions = {
    info: {
      title: 'Test API Documentation',
      version: '1.0.0',
    },
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    security: [{ jwt: [] }]
    
  };

  await server.register([
    require('hapi-auth-jwt2'),
    require('hapi-auth-basic'),
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions 
    }
  ]);


  // server.auth.strategy('simple', 'basic', {
  //   validate: users.verifyCredentials
  // });

  // server.auth.strategy('jwt', 'jwt', {
  //   key: 'secret',
  //   validate,
  //   verifyOptions: { algorithms: ['HS256'] }
    
  // });

 
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.log(err);
  }
})();
