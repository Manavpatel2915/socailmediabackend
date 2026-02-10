import swaggerAutogen from 'swagger-autogen';

export const doc = {
  info: {
    title: 'My API',
    description: 'Description'

  },
  tags: [
    { name: "User", description: "User related APIs" },
    { name: "Post", description: "Post related APIs" },
    { name: "Comment", description: "Comment related APIs" },
    { name: "Auth", description: "Authentication APIs" }
  ],
  host: 'localhost:3000'
};
const outputFile = './swagger-output.json';
const routes = ['src/server.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);