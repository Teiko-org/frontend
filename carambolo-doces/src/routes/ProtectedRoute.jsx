import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { axiosApi } from '../provider/AxiosApi';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    axiosApi.get(`/usuarios/${userId}`, { withCredentials: true })
      .then(res => {
        const data = res.data;
        if (localStorage.getItem("IS_SIGNED") === "true") {
          if (requireAdmin) {
            setAuthorized(data.admin === true);
          } else {
            setAuthorized(true);
          }
        } else {
          setAuthorized(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, [requireAdmin]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;