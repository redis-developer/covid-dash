const { redis } = require('../utils/redisClient');
const { stateCode } = require('../utils/stuff.json');
// const fs = require('fs');

const pipeline = redis.pipeline();

const daily = (data) => {
  Object.entries(data).forEach(([stateName, stateData]) => {
    if (stateData.hasOwnProperty('meta')) delete stateData.meta;
    if (stateData.hasOwnProperty('districts')) delete stateData.districts;
    Object.entries(stateData).forEach(([category, hash]) => {
      let hashList = [];
      Object.entries(hash).forEach(([x, y]) => {
        hashList.push(x, y);
      });
      pipeline.hmset(`sd:${category}:${stateName}`, hashList);
    });
  });

  // // REDISGEARS PYTHON FUNCTION IN ./pyFunc.py
  // const func = fs.readFileSync('./pyFunc.py').toString().replace(/[\n\r]/g, '');
  const func = `from collections import Counter;GB('KeysReader',defaultArg='sd:delta:*').map(lambda x:Counter({y:int(z) for y,z in x['value'].items()})).accumulate(lambda a,x:x+(a if a else Counter())+Counter({'states':1})).flatmap(lambda x:list(x.items())).foreach(lambda x:execute('HSET','nd',x[0],x[1])).run()`;
  // @ts-ignore
  pipeline.call('RG.PYEXECUTE', func);
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

module.exports = { daily, total };
