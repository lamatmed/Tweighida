import  {databases, storage} from '@/utils/appwrite'

import { ID } from "appwrite";

export async function addNote(formData: FormData): Promise<Note> {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const pdfFile = formData.get("pdf") as File | null;
    

let  pdfurl: string| null = null
    console.log("Fichier sélectionné :", pdfFile); // Vérifie si le fichier est bien récupéré

    if (pdfFile) {
        
   
        try {
            // Upload du fichier dans Appwrite Storage
            const fileResponse = await storage.createFile("fichiers", ID.unique(), pdfFile);
            
            // Récupérer l'URL sécurisée de téléchargement
             pdfurl = storage.getFileDownload("fichiers", fileResponse.$id);
            
             if (pdfurl.length > 240) {
                console.warn("L'URL du fichier dépasse 240 caractères, elle sera tronquée.");
                pdfurl = pdfurl.substring(0, 100);
            }

            console.log("Fichier uploadé avec succès :", pdfurl);
        } catch (error) {
            console.error("Erreur lors de l'upload du fichier :", error);
        }
    }

    const newNote = {
        content,
        title,
        pdfurl,
    };

    const response = await databases.createDocument(
        "notesApp",
        "notes",
        ID.unique(),
        newNote
    );

    return {
        $id: response.$id,
        $createdAt: response.$createdAt,
        content: response.content,
        title: response.title,
        pdfurl: response.pdfurl
    };
}


export async function getNotes(): Promise<Note[]>{
   
const response = await databases.listDocuments(
    'notesApp',
    'notes',
   
)
console.log(response.documents);
const notes: Note[]=response.documents.map((doc)=> ({
  
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        content: doc.content,
        title: doc.title,
        pdfurl: doc.pdfurl
   
}))

return notes;
}

export async function deleteNote(noteId: string){
    await databases.deleteDocument(
        'notesApp',
        'notes',
        noteId
    )
}

export async function updateNote(noteId: string, updatedContent: string, updatedTitle: string) {
    try {
      await databases.updateDocument(
        'notesApp',
        'notes',
        noteId,
        { content: updatedContent,title: updatedTitle }
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
    }
  }
 