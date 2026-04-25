const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME;

  if (!uri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  if (!dbName) {
    throw new Error("DB_NAME is missing in environment variables");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error("Database is not connected yet");
  }
  return db;
}

function getCollection(collectionName) {
  return getDb().collection(collectionName);
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  connectDB,
  getDb,
  getCollection,
  closeDB
};