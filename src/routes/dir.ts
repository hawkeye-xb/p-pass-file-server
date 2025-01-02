import Router from "koa-router";
import { createDir } from "../controllers/dir";

const router = new Router();

router
	.get("/", async (ctx) => {
		ctx.body = "Hello World: dir";
	}).post("/", createDir);

export default router;
