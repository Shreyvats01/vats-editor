import { createStore } from "jotai";

export const vatsStore: ReturnType<typeof createStore> = createStore();
export const novelStore = vatsStore;
export * from "jotai";

