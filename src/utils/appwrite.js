import { Client, Databases, Storage } from "appwrite";

export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Remplace par ton endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT); // Remplace par ton Project ID


export const databases = new Databases(client);
export const storage = new Storage(client);
