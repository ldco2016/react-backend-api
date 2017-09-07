const Router = require('express').Router;
const apiPagesMiddleware = require('./apiPagesMiddleware');

module.exports = apiConfig => {
  const apiRouter = Router();
  apiRouter.get(
    '/config/pages/:page',
    apiPagesMiddleware({
      config: apiConfig,
      dataResolver: data => {
        return Object.assign({}, data, {
          items: data.items &&
            data.items.map(key => {
              return Object.assign({}, apiConfig.pages[key], { key });
            }),
        });
      },
    })
  );
  return apiRouter;
};
