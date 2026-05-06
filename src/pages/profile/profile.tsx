import { TRegisterData } from '@api';
import { selectUser, updateUser } from '@slices/user';
import { useDispatch, useSelector } from '@store';
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

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

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;
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

    dispatch(updateUser(payload));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    />
  );
};
