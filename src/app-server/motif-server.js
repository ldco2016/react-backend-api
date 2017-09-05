const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { mergeWith } = require('lodash');

function mergeCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
const objMerge = (...args) => mergeWith(...args, mergeCustomizer);

const corsOverrides = (process.env.CORS_ORIGINS || '').split(',');
const helmetDefaults = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'"],
      connectSrc: ["'self'", 'www.google-analytics.com'],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'use.typekit.net',
        'www.google-analytics.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: [
        "'self'",
        '*.nfib.com',
        'p.typekit.net',
        'www.google-analytics.com',
      ],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'use.typekit.net'],
    },
  },
};

module.exports = (
  app,
  { cors: corsOptions = { origin: [] }, helmet: helmetOptions, environment }
) => {
  // necessary for csp in azure
  app.set('trust proxy', 1);
  app.set('x-powered-by', false);
  app.use(morgan(environment === 'development' ? 'dev' : 'tiny'));

  app.use(cors(objMerge(corsOptions, { origin: corsOverrides })));
  app.use(helmet(objMerge(helmetDefaults, helmetOptions)));

  // TODO: find out if we care to have this **"protected"**
  app.use(function(req, res, next) {
    res.set('X-ENV', environment);
    next();
  });

  return app;
};
