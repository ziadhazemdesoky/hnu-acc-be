// src/utils/queryParam.ts
import { ParsedQs } from "qs";

/**
 * Safely extracts a string from a query parameter.
 * @param param The query parameter value.
 * @returns The string value or null if not a valid string.
 */
export const getStringQueryParam = (param: string | ParsedQs | string[] | ParsedQs[] | undefined): string | null => {
  if (typeof param === "string") {
    return param;
  } else if (Array.isArray(param)) {
    // Take the first element if it's a string
    for (const p of param) {
      if (typeof p === "string") {
        return p;
      }
    }
  }
  return null;
};
