import { addWatchCtrl, unWatchCtrl } from "@/controllers/watch";
import Router from "koa-router";

const router = new Router();

router
	.post("/", addWatchCtrl)
	.delete("/", unWatchCtrl);

export default router;
