import mongodbconnect from './mongodbconnect';
import sqldbconnect from './sqldbconnnect';

const connectdb = (() => {
  mongodbconnect();
  // sqldbconnect is imported and runs its connection code automatically
  return sqldbconnect;
});
export default connectdb;