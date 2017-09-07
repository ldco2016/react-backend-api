const isSessionValid = ({ session }) =>
  !session || session.token === 'NFIBNodeToken';

const hydrateToken = ({ session }) => {
  session.lastUsedDate = new Date();
};

module.exports = {
  isSessionValid,
  hydrateToken,
};
