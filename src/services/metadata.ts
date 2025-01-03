// metadata cache
// import { EventEmitter } from "koa";

import { MetadataType } from "./utils/type";
import path from "path";

const metadatas: MetadataType[] = [];

export const addMetadatas = (target: any, metadata: any) => {
  metadatas.push(metadata);
};
export const deleteMetadatas = (target: any) => {
  const index = metadatas.findIndex((item) => item.path === target);
  if (index !== -1) {
    metadatas.splice(index, 1);
  }
};
export const getAllWatcherMetadatas = (target?: any) => {
  return metadatas; // Map没法直接作为返回值，需要转成可识别的
};

export const updateMetadata = (target: string, value: MetadataType) => {
  return updateValue(metadatas, target, value);
}

const updateValue = (nodes: MetadataType[], target: string, value: MetadataType) => {
  for (let i = 0; i < nodes.length; i++) {
    const v = nodes[i];
    if (path.normalize(v.path + path.sep) === path.normalize(target + path.sep)) {
      nodes[i] = value;
      return true;
    }

    if (v.children && target.startsWith(v.path + path.sep)) {
      return updateValue(v.children, target, value);
    }
  }

  return false;
}