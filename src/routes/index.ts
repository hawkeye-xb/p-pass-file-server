import Router from "koa-router";
import dirRouter from "./dir.ts";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "Hello World";
});

router.use("/dir", dirRouter.routes(), dirRouter.allowedMethods());

export default router;
