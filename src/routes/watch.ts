import { addWatchCtrl, unWatchCtrl, getWatchPathMetadata } from "@/controllers/watch";
import Router from "koa-router";

const router = new Router();

router
	.post("/", addWatchCtrl)
	.delete("/", unWatchCtrl)
	.get("/metadata", getWatchPathMetadata);

export default router;
