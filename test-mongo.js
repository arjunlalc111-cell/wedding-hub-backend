// test-mongo.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Missing MONGO_URI in environment');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

run().catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
