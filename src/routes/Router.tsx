import React from 'react';

import { Route, Routes } from 'react-router-dom';

import Error404 from '../common/components/404NotFound/Error404';
import { RoutePath } from '../common/enums/route-path';
import { CheckEmail } from '../features/forgotPassword/CheckEmail';
import { CreateNewPassword } from '../features/forgotPassword/CreateNewPassword';
import { ForgotPassword } from '../features/forgotPassword/ForgotPassword';
import { Login } from '../features/login/Login';
import { Profile } from '../features/profile/Profile';
import { Register } from '../features/register/Register';
import { ReturnComponentType } from '../types/ReturnComponentType';
import { RoutesType } from '../types/RoutesType';

export const Router = (): ReturnComponentType => {
  const routesArray: RoutesType[] = [
    { path: RoutePath.Error404, component: <Error404 /> },
    { path: RoutePath.Profile, component: <CheckEmail /> },
    { path: RoutePath.Login, component: <CreateNewPassword /> },
    { path: RoutePath.Register, component: <ForgotPassword /> },
    { path: RoutePath.ForgotPassword, component: <Login /> },
    { path: RoutePath.CheckEmail, component: <Profile /> },
    { path: RoutePath.CreateNewPassword, component: <Register /> },
  ];

  return (
    <Routes>
      {routesArray.map(item => (
        <Route key={item.path} path={item.path} element={item.component} />
      ))}
    </Routes>
  );
};

export default Router;