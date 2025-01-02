import { renameFile } from "@/controllers/file";
import Router from "koa-router";

const router = new Router();

router
	.patch("/", renameFile);

export default router;
