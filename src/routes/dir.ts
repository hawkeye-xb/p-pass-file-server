import Router from "koa-router";
import { createDir, deleteDirs, renameDir } from "../controllers/dir/index.ts";

const router = new Router();

router
	.post("/", createDir)
	.patch("/", renameDir)
	.delete("/", deleteDirs);

export default router;
