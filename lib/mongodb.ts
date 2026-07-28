import { MongoClient, ObjectId } from "mongodb";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient; mongoPromise?: Promise<MongoClient>; mongoUri?: string };

function mongoUri() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  return uri;
}

export async function mongoClient() {
  const uri = mongoUri();
  if (!globalForMongo.mongoPromise || globalForMongo.mongoUri !== uri) {
    const client = new MongoClient(uri);
    globalForMongo.mongoClient = client;
    globalForMongo.mongoPromise = client.connect();
    globalForMongo.mongoUri = uri;
  }
  return globalForMongo.mongoPromise;
}

export async function mongoDb() {
  const client = await mongoClient();
  return client.db(process.env.MONGODB_DB || "rednotebook");
}

export function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) throw new Error("Invalid id");
  return new ObjectId(id);
}
