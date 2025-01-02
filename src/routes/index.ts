import Router from "koa-router";
import dirRouter from "./dir.ts";
import { moveSrc } from "@/controllers/move.ts";
import fileRouter from "./file.ts";
import { deleteSrc } from "@/controllers/delete.ts";
import watchRouter from "./watch.ts";
import { getPathMetadata } from "@/controllers/metadata/index.ts";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "Hello World";
});

router.use("/dir", dirRouter.routes(), dirRouter.allowedMethods());
router.use("/file", fileRouter.routes(), fileRouter.allowedMethods());
router.use("/watch", watchRouter.routes(), watchRouter.allowedMethods());

router.post("/move", moveSrc);
router.post("/delete", deleteSrc);

router.get("/metadate", getPathMetadata);

export default router;
