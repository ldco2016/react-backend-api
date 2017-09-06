import fs from 'fs';
import cheerio from 'cheerio';
import path from 'path';

export default (req, resp) => {
  const data = fs.readFileSync(path.join('app', req.url));
  const $ = cheerio.load(data);

  const localConfig = Object.assign({}, resp.app.locals, resp.locals);
  const localVariableDefs = Object.keys(localConfig)
    .map(key => {
      return `var ${key} = ${JSON.stringify(localConfig[key])};`;
    }, '')
    .join(' ');
  // inject variables to the bottom of the body tag
  $('body').append(
    `<script type="text/javascript">${localVariableDefs}</script>`
  );
  return resp.send($.html());
};
