const Router = require('express').Router;
const apiRouter = require('./apiRouter');
const eventsRouter = require('./eventsRouter');

module.exports = config => {
  const routes = Router();
  routes.use('/api', apiRouter(config));
  routes.use('/events', eventsRouter(config));
  return routes;
};
