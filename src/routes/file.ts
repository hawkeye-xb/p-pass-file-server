import { renameFile, downloadFile, preUpload, uploadFile, uploadInstance } from "@/controllers/file";
import Router from "koa-router";

const router = new Router();

router
	.get("/pre-upload", preUpload)
	.get("/download", downloadFile)
	.post("/upload", uploadFile)
	.patch("/", renameFile);

export default router;
