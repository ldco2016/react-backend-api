const isSessionValid = ({ session }) =>
  !session || session.token === 'NFIBNodeToken';
const initializeSessionToken = ({ session }, resp, next) => {
  if (!isSessionValid({ session })) {
    session.token = 'NFIBNodeToken';
    session.lastUsedDate = new Date();
  }
  next();
};
const hydrateToken = ({ session }) => {
  session.lastUsedDate = new Date();
};

module.exports = {
  isSessionValid,
  hydrateToken,
  initializeSessionToken,
};
