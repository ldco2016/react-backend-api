const merge = require('lodash.merge');
module.exports = ({ config: { pages }, paramName = 'page', dataResolver }) => (
  req,
  res
) => {
  const dynamicPageConfig = JSON.parse(process.env.PAGE_CONFIG || '{}');
  const computedPages = merge(pages, dynamicPageConfig);
  const pageDef = computedPages[req.params[paramName]];
  if (!pageDef) {
    return res.status(404).json({ message: 'Page definition was not found.' });
  }
  let data = pageDef;
  if (typeof dataResolver === 'function') {
    data = dataResolver(data);
  }
  return res.json(data);
};
