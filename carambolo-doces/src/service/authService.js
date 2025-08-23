export const isLoggedIn = () => {
  return !!localStorage.getItem('IS_SIGNED');
};

export const logout = () => {
  localStorage.removeItem('IS_SIGNED');
};