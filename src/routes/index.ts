import Router from "koa-router";
import dirRouter from "./dir.ts";
import { moveSrc } from "@/controllers/move.ts";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "Hello World";
});

router.use("/dir", dirRouter.routes(), dirRouter.allowedMethods());

router.post("/move", moveSrc)

export default router;
