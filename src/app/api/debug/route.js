export async function GET() {
    return Response.json({
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    });
}
