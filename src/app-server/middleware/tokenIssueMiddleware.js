import { isSessionValid } from '../utils/session-tokens';

export default ({ session }, resp, next) => {
  if (!isSessionValid({ session })) {
    session.token = 'NFIBNodeToken';
    session.lastUsedDate = new Date();
  }
  next();
};
