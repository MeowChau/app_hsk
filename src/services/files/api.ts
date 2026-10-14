import { NativeModules } from 'react-native';
import { instance } from '../instance';

export interface PickedAvatar {
  uri: string;
  name: string;
  type: string;
  size: number;
}
interface UploadedFile {
  id: string;
  path: string;
}
const picker = NativeModules.AvatarPicker as
  | {
      pickImage: () => Promise<PickedAvatar | null>;
      releaseImage: (uri: string) => void;
    }
  | undefined;

export const filesApi = {
  pickAvatar: async (): Promise<PickedAvatar | null> => {
    if (!picker)
      throw new Error('Chức năng chọn ảnh chưa sẵn sàng trên thiết bị này.');
    return picker.pickImage();
  },
  releaseAvatar: (uri: string) => picker?.releaseImage(uri),
  uploadAvatar: async (avatar: PickedAvatar): Promise<UploadedFile> => {
    const form = new FormData();
    form.append('file', {
      uri: avatar.uri,
      name: avatar.name,
      type: avatar.type,
    } as unknown as Blob);
    const response = await instance
      .post('files/upload', { body: form })
      .json<{ file: UploadedFile }>();
    return response.file;
  },
};
