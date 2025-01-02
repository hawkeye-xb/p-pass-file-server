// metadata cache
import { EventEmitter } from "koa";

const metadatas = new Map();
export const metadataEvent = new EventEmitter();

export const setMetadatas = (target: any, metadata: any) => {
  metadatas.set(target, metadata);
  metadataEvent.emit("set", target, metadata);
};
export const deleteMetadatas = (target: any) => {
  metadatas.delete(target);
  metadataEvent.emit("delete", target);
};
export const getMetadatas = (target?: any) => {
  if (!target) {
    return metadatas;
  }
  return metadatas.get(target);
};