import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db = null;
const mongoClient = new MongoClient("mongodb://localhost:27017");


export default async function connectMongoDB() {
    try {
        await mongoClient.connect();
        db = mongoClient.db("Mywallet");
        console.log("conectado ao datacenter");
      } catch (err) {
        console.log(err);
      }
      return db;
};