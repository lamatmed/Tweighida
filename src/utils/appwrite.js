import { Client, Databases, Storage } from "appwrite";

// Récupération des variables d'environnement
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || "";
export const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "";


// Vérification des variables d'environnement
if (!endpoint || !project || !databaseId || !collectionId || !bucketId) {
    throw new Error("❌ Les variables d'environnement Appwrite ne sont pas définies !");
}

// Initialisation du client Appwrite
const client = new Client().setEndpoint(endpoint).setProject(project);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, databases, storage };
