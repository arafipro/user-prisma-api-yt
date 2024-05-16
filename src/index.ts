import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, User } from "@prisma/client";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.get("/users", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  try {
    const results = await prisma.user.findMany({
      select: { name: true, email: true },
    });
    return c.json(results);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});

app.get("/users/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  try {
    const result = await prisma.user.findUnique({
      where: { id: id },
    });
    return c.json(result);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});

app.post("/users", async (c) => {
  const { name, email } = await c.req.json<User>();
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.user.create({
      data: { name, email },
    });
    return c.json({ message: "Success" }, 201);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});

app.put("/users/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { name, email } = await c.req.json<User>();
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.user.update({
      where: { id: id },
      data: { name, email },
    });
    return c.json({ message: "Success" }, 200);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});

app.delete("/users/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.user.delete({
      where: { id: id },
    });
    return c.json({ message: "Success" }, 200);
  } catch (e) {
    return c.json({ error: e }, 500);
  }
});

export default app;
