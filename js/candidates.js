import { set, get } from "./storage.js";

export function getAllcandidates () {
   return get("candidates") || [];
}