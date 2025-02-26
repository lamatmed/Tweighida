import { Client, Databases, Storage } from "appwrite";

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT) {
    throw new Error("❌ Les variables d'environnement Appwrite ne sont pas définies !");
}

export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

export const databases = new Databases(client);
export const storage = new Storage(client);
