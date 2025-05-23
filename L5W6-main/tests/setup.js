const { MongoMemoryServer } = require('mongodb-memory-server');
const { initDatabase, mongoose } = require('../index.js');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await initDatabase(mongoUri);
  await mongoose.connection.dropDatabase();
}, 30000);

beforeEach(async () => {
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
  await mongoServer.stop();
  }
});