import { renameFile, downloadFile } from "@/controllers/file";
import Router from "koa-router";

const router = new Router();

router
	.get("/download", downloadFile)
	.patch("/", renameFile);

export default router;
