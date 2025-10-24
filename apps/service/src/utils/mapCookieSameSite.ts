type SameSite = "lax" | "strict" | "none" | undefined;

export function mapSameSite(
  sameSite?:
    | boolean
    | "lax"
    | "strict"
    | "none"
    | "Strict"
    | "Lax"
    | "None"
    | undefined,
): SameSite {
  if (sameSite === undefined) {
    return undefined;
  }

  if (typeof sameSite === "string") {
    return sameSite.toLowerCase() as SameSite;
  }

  if (typeof sameSite === "boolean") {
    return sameSite ? "strict" : undefined;
  }

  console.error("Error mapping sameSite value: ", sameSite);
}
