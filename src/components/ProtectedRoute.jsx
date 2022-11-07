import React from 'react';
import { Navigate } from 'react-router-dom';

// interface PrivateRouteProps {
//   rolePossessed: number;
//   roleRequired: number;
//   children: React.ReactNode;
// }

const ProtectedRoute = ({ rolePossessed, roleRequired, children }) => {
   return (rolePossessed < roleRequired) ? <Navigate to="/" replace /> : children
};

export default ProtectedRoute