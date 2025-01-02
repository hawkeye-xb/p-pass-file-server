import Router from "koa-router";
import { createDir, renameDir } from "../controllers/dir/index.ts";

const router = new Router();

router
	.post("/", createDir)
	.patch("/", renameDir);

export default router;
