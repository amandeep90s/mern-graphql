import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB");
} catch (error) {
  console.log(error);
}

const db = client.db("mern_graphql");

export default db;
