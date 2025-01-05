import { renameFile, downloadFile, preUpload } from "@/controllers/file";
import Router from "koa-router";

const router = new Router();

router
	.get("/pre-upload", preUpload)
	.get("/download", downloadFile)
	.patch("/", renameFile);

export default router;
