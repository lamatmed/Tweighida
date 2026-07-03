'use server'

import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Mappage du modèle Prisma vers l'interface Note de l'application
function mapPrismaNote(note: any): Note {
    return {
        $id: note.id,
        $createdAt: note.createdAt.toISOString(),
        content: note.content,
        title: note.title,
        venda: note.venda,
        pdfurl: note.pdfurl || '',
    };
}

export async function addNote(formData: FormData): Promise<Note> {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const pdfFile = formData.get("pdf") as File | null;
    const venda = Number(formData.get("venda"));

    let pdfurl: string | null = null;
   
    console.log("Fichier sélectionné :", pdfFile);

    if (pdfFile && pdfFile.name) {
        try {
            // Création du dossier d'upload local si nécessaire
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Génération d'un nom de fichier unique
            const filename = `${Date.now()}-${pdfFile.name}`;
            const filepath = path.join(uploadDir, filename);

            // Conversion du fichier en buffer et écriture
            const buffer = Buffer.from(await pdfFile.arrayBuffer());
            await fs.promises.writeFile(filepath, buffer);

            // URL relative pour l'accès public
            pdfurl = `/uploads/${filename}`;
            console.log("Fichier uploadé avec succès localement :", pdfurl);
        } catch (error) {
            console.error("Erreur lors de l'upload du fichier :", error);
        }
    }

    try {
        const response = await prisma.note.create({
            data: {
                content,
                title,
                pdfurl,
                venda,
            }
        });

        return mapPrismaNote(response);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la note :", error);
        throw new Error("Impossible d'ajouter la note");
    }
}

export async function getNotes(): Promise<Note[]> {
    try {
        const response = await prisma.note.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log("Total documents in database:", response.length);

        return response.map(mapPrismaNote);
    } catch (error) {
        console.error("Erreur lors de la récupération des notes :", error);
        return [];
    }
}

// Conserver getNotesFromAppwrite comme alias pour éviter de casser les imports existants
export const getNotesFromAppwrite = getNotes;

export async function deleteNote(noteId: string) {
    try {
        // Récupérer la note pour savoir si elle a un PDF à supprimer du disque
        const note = await prisma.note.findUnique({
            where: { id: noteId }
        });

        if (note && note.pdfurl && note.pdfurl.startsWith('/uploads/')) {
            const filename = note.pdfurl.replace('/uploads/', '');
            const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                console.log(`Fichier PDF local supprimé : ${filepath}`);
            }
        }

        await prisma.note.delete({
            where: { id: noteId }
        });
        console.log(`Note supprimée : ${noteId}`);
    } catch (error) {
        console.error("Erreur lors de la suppression de la note :", error);
    }
}

export async function updateNote(noteId: string, updatedContent: string, updatedTitle: string, updatedVenda: number) {
    try {
        await prisma.note.update({
            where: { id: noteId },
            data: {
                content: updatedContent,
                title: updatedTitle,
                venda: updatedVenda
            }
        });
        console.log(`Note mise à jour : ${noteId}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la note :", error);
    }
}

