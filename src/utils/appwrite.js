import { Client, Databases, Storage } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

if (!endpoint || !project) {
    throw new Error("❌ Les variables d'environnement Appwrite ne sont pas définies !");
}

export const client = new Client().setEndpoint(endpoint).setProject(project);
export const databases = new Databases(client);
export const storage = new Storage(client);
