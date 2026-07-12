import { get,set } from "./storage.js";

export function getAllVotes () {
    return get("votes") || [];
}



