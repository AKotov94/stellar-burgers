import { TRegisterData } from '@api';
import { selectUser, selectUserError, updateUser } from '@slices/user';
import { useDispatch, useSelector } from '@store';
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */

  const user = useSelector(selectUser);
  const storeErr = useSelector(selectUserError);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  // const [updError, setUpdError] = useState<string | null>(null);

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    // setUpdError(null);

    const payload: Partial<TRegisterData> = {};

    if (formValue.name !== user?.name) {
      payload.name = formValue.name;
    }

    if (formValue.email !== user?.email) {
      payload.email = formValue.email;
    }

    if (formValue.password) {
      payload.password = formValue.password;
    }

    try {
      const update = await dispatch(updateUser(payload)).unwrap();

      if (update.success) {
        setFormValue((prev) => ({
          ...prev,
          password: ''
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // setUpdError(null);
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setUpdError(null);
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={storeErr ?? undefined}
    />
  );
};
