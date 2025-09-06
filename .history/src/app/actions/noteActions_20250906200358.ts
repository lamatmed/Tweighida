import { databases, storage, databaseId, collectionId, bucketId } from '@/utils/appwrite';
import { ID, Query } from "appwrite";

export async function addNote(formData: FormData): Promise<Note> {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const pdfFile = formData.get("pdf") as File | null;
    const venda = Number(formData.get("venda"));

    let pdfurl: string | null = null;
   
    console.log("Fichier sélectionné :", pdfFile);

    if (pdfFile) {
        try {
            // Upload du fichier dans Appwrite Storage
            const fileResponse = await storage.createFile(bucketId, ID.unique(), pdfFile);
            
            // Récupérer l'URL sécurisée de téléchargement
            pdfurl = storage.getFileDownload(bucketId, fileResponse.$id);

            // Vérification de la longueur de l'URL
            if (pdfurl.length > 240) {
                console.warn("L'URL du fichier dépasse 240 caractères, elle sera tronquée.");
                pdfurl = pdfurl.substring(0, 100);
            }

            console.log("Fichier uploadé avec succès :", pdfurl);
        } catch (error) {
            console.error("Erreur lors de l'upload du fichier :", error);
        }
    }

    try {
        const newNote = {
            content,
            title,
            pdfurl,
            venda,
        };

        const response = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            newNote
        );

        return {
            $id: response.$id,
            $createdAt: response.$createdAt,
            content: response.content,
            title: response.title,
            pdfurl: response.pdfurl,
            venda: response.venda,
        };
    } catch (error) {
        console.error("Erreur lors de l'ajout de la note :", error);
        throw new Error("Impossible d'ajouter la note");
    }
}

export async function getNotesFromAppwrite(): Promise<Note[]> {
    try {
        const response = await databases.listDocuments(
            databaseId, 
            collectionId,
            [
                // Augmenter la limite à 100 pour s'assurer de récupérer tous les documents
                Query.limit(100)
            ]
        );
        console.log("Total documents in response:", response.total);
        console.log("Documents array length:", response.documents.length);
        console.log("All documents:", response.documents);

        const notes = response.documents.map((doc) => ({
            $id: doc.$id,
            $createdAt: doc.$createdAt,
            content: doc.content,
            title: doc.title,
            venda: doc.venda,
            pdfurl: doc.pdfurl
        }));

        console.log("Mapped notes length:", notes.length);
        return notes;
    } catch (error) {
        console.error("Erreur lors de la récupération des notes :", error);
        throw new Error("Impossible de récupérer les notes"); // ou throw error;
    }
}


export async function deleteNote(noteId: string) {
    try {
        await databases.deleteDocument(databaseId, collectionId, noteId);
        console.log(`Note supprimée : ${noteId}`);
    } catch (error) {
        console.error("Erreur lors de la suppression de la note :", error);
    }
}

export async function updateNote(noteId: string, updatedContent: string, updatedTitle: string,updatedVenda:number) {
    try {
        await databases.updateDocument(databaseId, collectionId, noteId, {
            content: updatedContent,
            title: updatedTitle,
            venda: updatedVenda
        });
        console.log(`Note mise à jour : ${noteId}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la note :", error);
    }
}
