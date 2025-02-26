export async function GET() {
    return Response.json({
        NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "❌ Non défini",
        NEXT_PUBLIC_APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "❌ Non défini",
    });
}
