import Router from "koa-router";
import { createDir } from "../controllers/dir";
import { renameDir } from "../controllers/dir/rename";

const router = new Router();

router
	.get("/", async (ctx) => {
		ctx.body = "Hello World: dir";
	}).post("/", createDir)
	.patch("/", renameDir);

export default router;
