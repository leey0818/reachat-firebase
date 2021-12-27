import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { CurrentUserState, setCurrentUser } from '@store/modules/user';
import { Button, message, Modal, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { getAuth, updateProfile, User } from 'firebase/auth';
import { getDatabase, ref as dbRef, update } from 'firebase/database';
import { deleteObject, getDownloadURL, getStorage, ref, StorageReference, uploadBytes } from 'firebase/storage';
import { useCallback, useState } from 'react';
import md5 from 'md5';
import styled from 'styled-components';

type ProfileUploadModalProps = {
  visible: boolean;
  onChanged: () => void;
  onClose: () => void;
};

const HelpList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: circle;
  > li {
    margin-left: 20px;
  }
`;

const getBase64Image = (file: RcFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', (error) => reject(error));
    reader.readAsDataURL(file);
  });
};

const updateProfileImage = (uid: string, imageUrl: string) => {
  const db = getDatabase();
  const updateDatabase = update(dbRef(db, `users/${uid}`), {
    avatar: imageUrl,
  });

  const auth = getAuth();
  const updateUserPhotoURL = updateProfile(auth.currentUser as User, {
    photoURL: imageUrl,
  });

  return Promise.all([updateDatabase, updateUserPhotoURL]).then(() => imageUrl);
};

const deleteImageFromStorage = (ref: StorageReference) => {
  return deleteObject(ref).catch((error) => {
    if (error.code === 'storage/object-not-found') {
      return Promise.resolve();
    }
    throw error;
  });
};

function ProfileUploadModal(props: ProfileUploadModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser) as CurrentUserState;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const setFile = (file: UploadFile) => setFiles([file]);

  const handleRemove = () => setFiles([]);
  const handleBeforeUpload = (file: RcFile) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      message.warn('JPG/PNG 이미지 파일만 업로드 할 수 있습니다.');
      return false;
    }
    if (file.size > 1024 * 50) {
      message.warn('50KiB 이하의 이미지 파일만 업로드 할 수 있습니다.');
      return false;
    }

    getBase64Image(file)
      .then((dataUrl) => {
        setFile({
          ...file,
          thumbUrl: dataUrl,
          originFileObj: file,
        });
      })
      .catch((error) => {
        message.error(error.message);
      });

    return false;
  };

  const handleClickDefaultImage = () => {
    setFile({
      uid: 'gravatar_image',
      name: 'Gravatar image',
      thumbUrl: `https://www.gravatar.com/avatar/${md5(user.email)}?d=identicon`,
    });
  };

  const handleClickChange = useCallback(() => {
    if (!files.length) return;

    setLoading(true);

    const file = files[0];
    const orgFile = file.originFileObj as RcFile;
    const isSetDefaultImage = file.uid === 'gravatar_image';

    let promise: Promise<string>;
    const storage = getStorage();
    const fileRef = ref(storage, `avatars/${user.uid}`);

    if (isSetDefaultImage) {
      promise = deleteImageFromStorage(fileRef).then(() => file.thumbUrl as string);
    } else {
      promise = uploadBytes(fileRef, orgFile).then(() => getDownloadURL(fileRef));
    }

    promise
      .then((imageUrl) => updateProfileImage(user.uid, imageUrl))
      .then((imageUrl) => dispatch(setCurrentUser({ ...user, avatar: imageUrl })))
      .then(() => {
        setLoading(false);
        props.onChanged();
      })
      .catch((error) => {
        setLoading(false);
        message.error(`업로드 실패: ${error.message}`);
      });
  }, [files, user]);

  return (
    <Modal
      title="프로필 사진 변경"
      destroyOnClose={true}
      visible={props.visible}
      onCancel={props.onClose}
      footer={[
        <Button key="setdefault" style={{ float: 'left' }} onClick={handleClickDefaultImage}>
          기본 이미지로 변경
        </Button>,
        <Button key="change" type="primary" loading={loading} disabled={!files.length} onClick={handleClickChange}>
          Change
        </Button>,
      ]}
    >
      <div>
        <Upload
          accept="image/png, image/jpeg"
          listType="picture-card"
          maxCount={1}
          showUploadList={{ showPreviewIcon: false }}
          disabled={loading}
          fileList={files}
          beforeUpload={handleBeforeUpload}
          onRemove={handleRemove}
        >
          <div>
            {files.length ? <ReloadOutlined /> : <PlusOutlined />}
            <div>파일선택</div>
          </div>
        </Upload>
      </div>
      <HelpList>
        <li>이미지 크기는 50KiB 이하이여야 합니다.</li>
        <li>JPG/PNG 파일만 업로드할 수 있습니다.</li>
      </HelpList>
    </Modal>
  );
}

export default ProfileUploadModal;
