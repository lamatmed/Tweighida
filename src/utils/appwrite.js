import { Account, Client, Databases, Storage } from "appwrite";

export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "67bdb779002991c26e2c");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
