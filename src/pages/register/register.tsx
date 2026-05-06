import { TRegisterData } from '@api';
import { registerUser, selectUserError } from '@slices/user';
import { useDispatch, useSelector } from '@store';
import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const registerData: TRegisterData = {
      email: email,
      name: userName,
      password: password
    };

    dispatch(registerUser(registerData));
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
