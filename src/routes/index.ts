import Router from "koa-router";
import dirRouter from "./dir.ts";
import { moveSrc } from "@/controllers/move.ts";
import fileRouter from "./file.ts";
import { deleteSrc } from "@/controllers/delete.ts";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "Hello World";
});

router.use("/dir", dirRouter.routes(), dirRouter.allowedMethods());
router.use("/file", fileRouter.routes(), fileRouter.allowedMethods());

router.post("/move", moveSrc);
router.post("/delete", deleteSrc);

export default router;
