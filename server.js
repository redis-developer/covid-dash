const config = require('better-config');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const logger = require('./utils/logger');
config.set('./config.json');

const app = express();
// @ts-ignore
app.use(morgan('combined', { stream: logger.stream }));
app.use(cors());
app.use((req, res, next) => {
  /*
  To allow case insensitive urls, just in case
  */
  for (var key in req.query) req.query[key.toLowerCase()] = req.query[key];
  next();
});
app.use('/api', routes);

const port = config.get('application.port');
app.listen(port, async () => {
  logger.info(`Application listening on port ${port}`);
});
