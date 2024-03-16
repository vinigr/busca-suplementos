import { password } from "bun";
import Elysia, { t } from "elysia";
import { db } from "../db/db";
import { jwt } from "@elysiajs/jwt";
import { config } from "../config";

export const authRoutes = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: config.jwtToken,
    })
  )
  .post(
    "/admin/login",
    async ({ body, set, jwt, params }) => {
      const user = await db.users
        .select("id", "password")
        .findByOptional({ login: body.login });

      if (!user) {
        set.status = 401;

        return { message: "Usuário ou senha incorreta" };
      }

      const correctedPassword = await password.verify(
        body.password,
        user.password,
        "bcrypt"
      );

      if (!correctedPassword) {
        set.status = 401;

        return { message: "Usuário ou senha incorreta" };
      }

      const token = await jwt.sign({
        ...(params as any),
        sub: user.id.toString(),
      });

      return { token };
    },
    {
      body: t.Object({
        login: t.String({ error: "Login é obrigatório" }),
        password: t.String({ error: "A senha é obrigatória" }),
      }),
      response: {
        200: t.Object({
          token: t.String(),
        }),
        401: t.Object({
          message: t.String(),
        }),
      },
    }
  );
