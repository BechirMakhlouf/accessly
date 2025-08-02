import { v4 } from "uuid"

//TODO: bayi: what if the extension is null?
export function createAvatarPath(user_id: string, file: File) {
  const fileExt = file.name.split(".").pop()
  return `${user_id}/${v4()}.${fileExt}`
}

