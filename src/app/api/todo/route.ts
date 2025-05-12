// app/api/todo/route.ts (ou pages/api/todo.ts)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return new Response(JSON.stringify(todos), { status: 200 });
}

export async function POST(request: Request) {
  const { title } = await request.json();

  if (!title) {
    return new Response("Title is required", { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: { title },
  });

  return new Response(JSON.stringify(todo), { status: 201 });
}

export async function PUT(request: Request) {
  const { id, title, completed } = await request.json();

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  const todo = await prisma.todo.update({
    where: { id },
    data: { title, completed },
  });

  return new Response(JSON.stringify(todo), { status: 200 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  await prisma.todo.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
}
