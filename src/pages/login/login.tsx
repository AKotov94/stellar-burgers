import { TLoginData } from '@api';
import { loginUser, selectUserError } from '@slices/user';
import { useDispatch, useSelector } from '@store';
import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const loginData: TLoginData = {
      email: email,
      password: password
    };

    dispatch(loginUser(loginData));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
