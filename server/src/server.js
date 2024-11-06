import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import gql from "graphql-tag";
import path from "path";
import { fileURLToPath } from "url";
import resolvers from "./resolvers.js";
import records from "./routes/record.js";

const PORT = process.env.PORT ?? 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = gql(
  readFileSync(path.join(__dirname, "schema.graphql"), { encoding: "utf-8" })
);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();

app.use("/record", records);

// Specify the path to mount the server
app.use("/graphql", cors(), express.json(), expressMiddleware(server));

// Start the express server
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
