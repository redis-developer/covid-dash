const { redis } = require('../utils/redisClient');
const { stateCode } = require('../utils/stuff.json');

const pipeline = redis.pipeline();

const statedaily = (data) => {
  Object.entries(data).forEach(([stateName, stateData]) => {
    if (stateData.hasOwnProperty('meta')) delete stateData.meta;
    if (stateData.hasOwnProperty('districts')) delete stateData.districts;
    Object.entries(stateData).forEach(([category, hash]) => {
      let hashList = [];
      Object.entries(hash).forEach(([x, y]) => {
        hashList.push(x, y);
      });
      pipeline.hmset(`sd:${stateName}:${category}`, hashList);
    });
  });
  return pipeline.exec();
};

const total = (data) => {
  let hashList;
  Object.values(data.states).forEach((hash) => {
    const stateName = stateCode[hash.state];
    delete hash.state;
    hashList = [];
    Object.entries(hash).forEach(([x, y]) => {
      hashList.push(x, y);
    });
    pipeline.hmset(`st:${stateName}`, hashList);
  });
  hashList = [];
  Object.entries(data.totals).forEach(([x, y]) => {
    hashList.push(x, y);
  });
  pipeline.hmset('nt', hashList);
  return pipeline.exec();
};

const nationaldaily = () => {
  const func =
    "from collections import Counter;GB().map(lambda x:Counter(x['value'])).accumalate(lambda a,x:x+(a if a else Counter({}))).register('sd:*:delta')";
  redis.call('RG.PYEXECUTE', func);
};
module.exports = { statedaily, total };
