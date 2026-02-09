import swaggerAutogen from 'swagger-autogen';

 export const doc = {
  info: {
    title: 'My API',
    description: 'Description'

  },
  host: 'localhost:3000'
};
const outputFile = './swagger-output.json';
const routes = ['src/server.ts'];


swaggerAutogen()(outputFile, routes, doc);