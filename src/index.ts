import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
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

export default app;
