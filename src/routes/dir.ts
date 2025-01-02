import Router from "koa-router";
import { createDir, deleteDir, renameDir } from "../controllers/dir";

const router = new Router();

router
	.post("/", createDir)
	.patch("/", renameDir)
	.delete("/", deleteDir);

export default router;
