import { renameFile, downloadFile, preUpload, uploadFile, aggregateFiles } from "@/controllers/file";
import Router from "koa-router";

const router = new Router();

router
	.get("/pre-upload", preUpload)
	.get("/download", downloadFile)
	.post("/upload", uploadFile)
	.post("/aggregate", aggregateFiles)
	.patch("/", renameFile);

export default router;
