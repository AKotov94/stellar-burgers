import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi, TRegisterData } from '@api';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerData: TRegisterData = {
    email: email,
    name: userName,
    password: password
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const registerResponse = registerUserApi(registerData);
    console.log(registerResponse);
  };

  return (
    <RegisterUI
      errorText=''
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
