import { v4 } from 'uuid';

export function createAvatarPath(user_id: string, file: File) {
  const fileExt = file.name.split('.').pop();
  if (!fileExt) {
    throw new Error('File must have an extension');
  }
  return `${user_id}/${v4()}.${fileExt}`;
}
