import Router from "koa-router";
import { createDir, downloadDir, renameDir } from "../controllers/dir/index.ts";

const router = new Router();

router
	.get("/download", downloadDir)
	.post("/", createDir)
	.patch("/", renameDir);

export default router;
