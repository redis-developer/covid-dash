const router = require('express').Router();
const apiError = require('../utils/apierror');
const { query } = require('express-validator');
const { redis } = require('../utils/redisClient');

const acceptedQueries = (queryName, ...validSections) => {
   return query(queryName)
      .isString()
      .optional()
      .custom((value, { req }) => {
         const sections = req.query[queryName];
         const arrayOfSections = sections.split(',');
         for (const str of arrayOfSections) {
            if (!validSections.includes(str)) {
               throw new Error(`Invalid value ${str} for ${queryName}.`);
            }
         }
         return true;
      });
};

router.get(
   '/india',
   [
      acceptedQueries('section', 'cases', 'deceased', 'vaccinated', 'tested'),
      apiError,
   ],
   async (req, res, next) => {
      // TODO Check redis for currently active,recovered,died and total cases
      if (req.query.has('section')) {
         const section = req.query.section.split(',');
         const response = await redis.hmget('total', ...section);
         let jsonRes = {};
         for (let x = 0; x < section.length; x++) {
            jsonRes[section[x]] = response[x];
         }
         res.status(200).json(jsonRes);
      } else {
         const [cases, deceased, recovered, vaccinated, tested] =
            await redis.hmget(
               'total',
               'cases',
               'deceased',
               'recovered',
               'vaccinated',
               'tested'
            );
         res.status(200).json({
            cases,
            deceased,
            recovered,
            vaccinated,
            tested,
         });
      }
   }
);

module.exports = router;
