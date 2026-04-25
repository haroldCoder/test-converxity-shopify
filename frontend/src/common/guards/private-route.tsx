import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  isAuth: boolean;
  children: JSX.Element;
};

export function PrivateRoute({
  isAuth,
  children,
}: Props) {
  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return children;
}