import { set, get } from "./storage.js";

export function getAllElections () {
   return get("elections") || [];
}