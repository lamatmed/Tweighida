import { Client, Databases, Storage } from "appwrite";

export const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Remplace par ton endpoint
    .setProject("67bdb779002991c26e2c"); // Remplace par ton Project ID

export const databases = new Databases(client);
export const storage = new Storage(client);
