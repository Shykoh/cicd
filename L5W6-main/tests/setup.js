const { MongoMemoryServer } = require('mongodb-memory-server');
const { initDatabase, mongoose } = require('../index.js');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await initDatabase(mongoUri);
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});