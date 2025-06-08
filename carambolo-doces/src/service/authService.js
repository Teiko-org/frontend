export const getToken = () => {
  return localStorage.getItem('TOKEN_JWT');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('IS_SIGNED');
};

export const logout = () => {
  localStorage.removeItem('TOKEN_JWT');
  localStorage.removeItem('IS_SIGNED');
};