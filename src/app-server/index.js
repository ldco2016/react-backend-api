const redirect = require('express-redirect');
const session = require('express-session');
const initializeMotifServer = require('./motif-server');
const { mergeWith } = require('lodash');
const routes = require('./routes');
const {
  initializeSessionToken,
  isSessionValid,
  hydrateToken,
} = require('./utils/session-tokens');

const apiConfig = require('./configs/apiConfig.js');
const serverConfig = require('./configs/serverConfig.js');
const proxySetupMiddleware = require('./middleware/proxySetupMiddleware');
function mergeCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
const objMerge = (...args) => mergeWith(...args, mergeCustomizer);

const APP_ID_HEADER_KEY = 'NFIBAppID';
const environment = process.env.NODE_ENV || 'development';

const getEnvBasedValue = obj =>
  (typeof obj === 'object' ? obj[environment] : obj);

module.exports = (engageServer, config) => {
  let mergedConfig = objMerge(serverConfig, config);
  const appId = process.env.APP_ID || getEnvBasedValue(mergedConfig.appId);
  mergedConfig = objMerge(mergedConfig, { appId, environment });
  initializeMotifServer(engageServer, mergedConfig);

  // initialize session
  engageServer.use(
    session(
      objMerge(mergedConfig.session, {
        secret: process.env.SESSION_SECRET,
      })
    )
  );

  // these will be auto-injected with the appendScriptMiddleware
  engageServer.locals = {
    GOOGLE_TRACKING_ID: process.env.GA_ID ||
      getEnvBasedValue(mergedConfig.tracking.google),
  };

  engageServer.use('/api', (req, resp, next) => {
    if (req.headers['x-htua-ssapyb'] === 'true' || isSessionValid(req)) {
      hydrateToken(req);
      next();
    } else {
      // todo: this should not be a 500, it should be a 403
      // This may break contract with the client so will not edit at this point
      return resp
        .status(500)
        .json({ message: 'Application identifier missing.' });
    }
  });

  /*Start Proxy Initialization*/
  const proxyOnRequest = proxyReq => {
    if (!proxyReq.getHeader(APP_ID_HEADER_KEY)) {
      proxyReq.setHeader(APP_ID_HEADER_KEY, appId);
    }
  };
  const proxyDefs = proxySetupMiddleware(mergedConfig, {
    onProxyReq: proxyOnRequest,
  });
  proxyDefs.forEach(proxy => engageServer.use(proxy.route, proxy.middleware));
  /*End Proxy Initialization*/

  /*Start Redirect Initialization*/
  redirect(engageServer);
  const redirectOptions = objMerge(
    mergedConfig.redirect,
    JSON.parse(process.env.REDIRECT_OPTIONS || '{}')
  );
  Object.keys(redirectOptions).forEach(key => {
    engageServer.redirect(
      `/redirect/${key}`,
      getEnvBasedValue(redirectOptions[key]),
      302,
      true
    );
  });
  /*End Redirect Initialization*/

  /*Add Routes*/
  engageServer.use(routes(objMerge(mergedConfig, apiConfig)));

  engageServer.use('*/index.html', initializeSessionToken);

  return engageServer;
};
