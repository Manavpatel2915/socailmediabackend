import swaggerAutogen from 'swagger-autogen';

const swaggerAutogenInstance = swaggerAutogen();

const doc = {
  info: {
    title: 'Wanderlust API',
    description: 'API documentation for the Wanderlust backend service.',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'User', description: 'User related endpoints' },
    { name: 'Post', description: 'Post related endpoints' },
    { name: 'Comment', description: 'Comment related endpoints' },
  ],
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/server.ts'];

swaggerAutogenInstance(outputFile, endpointsFiles, doc).then(() => {
  
});

