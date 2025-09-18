import { ParamValue } from "next/dist/server/request/params";

/**
 * Safely extracts a string value from Next.js ParamValue
 *
 * @param paramValue - The ParamValue from useParams()
 * @returns The string value if it's a string, undefined otherwise
 */
export function getStringFromParamValue(
    paramValue: ParamValue,
): string | undefined {
    if (typeof paramValue === "string") {
        return paramValue;
    }
    if (Array.isArray(paramValue) && paramValue.length > 0) {
        return paramValue[0];
    }
    return undefined;
}
