export const getToken = () => {
  return localStorage.getItem('JWT_TOKEN');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('IS_SIGNED');
};

export const logout = () => {
  localStorage.removeItem('JWT_TOKEN');
  localStorage.removeItem('IS_SIGNED');
};