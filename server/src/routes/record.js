import express from "express";
import { ObjectId } from "mongodb"; // This help convert the id from string to ObjectId for the _id.
import db from "../db/connection.js"; // This will help us connect to the database

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (_req, res) => {
  const collection = db.collection("records");
  const results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  const collection = db.collection("records");
  const query = { _id: ObjectId.createFromHexString(req.params.id) };
  const result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const collection = db.collection("records");
    const result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: ObjectId.createFromHexString(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const collection = db.collection("records");
    const result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: ObjectId.createFromHexString(req.params.id) };
    const collection = db.collection("records");
    const result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (error) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
