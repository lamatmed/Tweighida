import { Client, Databases, Storage } from "appwrite";

const client = new Client();
client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);
const storage = new Storage(client);

// Vérification que les variables ne sont pas déclarées en double
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || "";
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "";

// Export unique
export { client, databases, storage, databaseId, collectionId, bucketId };
