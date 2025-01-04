import Router from "koa-router";
import { createDir, createTemporaryDir, downloadDir, renameDir } from "../controllers/dir/index.ts";

const router = new Router();

router
	.get("/download", downloadDir)
	.post("/", createDir)
	.post("/temporary", createTemporaryDir)
	.patch("/", renameDir);

export default router;
