export const isEmpty = value => {
  if (!value) {
    return false;
  }
  return !!value.toString().trim();
};