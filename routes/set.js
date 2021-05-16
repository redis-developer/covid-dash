const router = require('express').Router();
const fetch = require('node-fetch');
const { param } = require('express-validator');
const apiError = require('../utils/apierror');
const dataLoader = require('../utils/dataLoader');
const { apiLinks } = require('../utils/stuff.json');

const acceptedParams = (paramName, validSections) => {
  return param(paramName)
    .isString()
    .custom((value, { req }) => {
      if (!validSections.includes(req.params[paramName])) {
        throw new Error(
          `Invalid value ${req.params[paramName]} for /set/:${paramName}.`
        );
      }
      return true;
    });
};

router.get('/set/nationaldaily', apiError, async (req, res) => {
  let error;
  await dataLoader.nationaldaily().catch((err) => {
    error = res.status(500).send(err);
  });
  return error || res.status(200).send('OK');
});

router.get(
  '/set/:data',
  [acceptedParams('data', Object.keys(apiLinks)), apiError],
  async (req, res) => {
    let error;
    const apiResponse = await fetch(apiLinks[req.params.data]).catch((err) => {
      error = res.status(503).json(err);
    });
    if (!error && apiResponse.status === 200) {
      const dataJSON = await apiResponse.json();
      await dataLoader[req.params.data](dataJSON).catch((err) => {
        error = res.status(500).send(err);
      });
      return error || res.status(200).send('OK');
    } else {
      return error || res.status(apiResponse.status).send(apiResponse);
    }
  }
);

module.exports = router;
