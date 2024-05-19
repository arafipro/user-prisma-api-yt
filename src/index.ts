import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, User } from "@prisma/client";
import { Hono } from "hono";
import { contextPrisma } from "./prisma";

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// app.use(
//   "/users",
//   cors({
//     origin: ["{許可するURL1}", "{許可するURL2}"],
//     allowHeaders: [
//       "X-Custom-Header",
//       "Upgrade-Insecure-Requests",
//       "Content-Type",
//     ],
//     allowMethods: ["GET", "POST", "OPTIONS"],
//     exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
//     maxAge: 600,
//     credentials: true,
//   })
// );

// app.use(
//   "/users/*",
//   cors({
//     origin: ["{許可するURL1}", "{許可するURL2}"],
//     allowHeaders: [
//       "X-Custom-Header",
//       "Upgrade-Insecure-Requests",
//       "Content-Type",
//     ],
//     allowMethods: ["GET", "PUT", "DELETE", "OPTIONS"],
//     exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
//     maxAge: 600,
//     credentials: true,
//   })
// );

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
  const prisma = contextPrisma(c);
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
