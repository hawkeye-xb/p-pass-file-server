// metadata cache
// import { EventEmitter } from "koa";

const metadatas = new Map();
// export const metadataEvent = new EventEmitter();

// export const setMetadatas = (target: any, metadata: any) => {
//   // metadataEvent.emit("set", target, metadata);
// };
export const addMetadatas = (target: any, metadata: any) => {
  metadatas.set(target, metadata);
  // metadataEvent.emit("add", target, metadata);
};
export const deleteMetadatas = (target: any) => {
  metadatas.delete(target);
  // metadataEvent.emit("delete", target);
};
export const getMetadatas = (target?: any) => {
  if (!target) {
    return metadatas; // Map没法直接作为返回值，需要转成可识别的
  }
  return metadatas.get(target);
};