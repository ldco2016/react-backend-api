const url = require('url');
const proxyMiddleware = require('http-proxy-middleware');

const logLevel = process.env.PROXY_LOG_LEVEL || 'warn';

module.exports = function({ proxies, environment }, eventHandlers) {
  return Object.keys(proxies).map(key => {
    const def = proxies[key];
    const { url: proxyUrl, route } = def;
    const target = typeof proxyUrl === 'object'
      ? url.parse(proxyUrl[environment]).href
      : proxyUrl;

    const middleware = proxyMiddleware(
      Object.assign(
        {},
        {
          logLevel,
          target,
          changeOrigin: true,
          pathRewrite: {
            [`^${route}`]: '',
          },
        },
        def.properties,
        eventHandlers
      )
    );
    return Object.assign({}, def, { route, middleware });
  });
};
