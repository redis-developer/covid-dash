from collections import Counter;
GB()
.map(lambda x:Counter({y:int(z) for y,z in x['value'].items()}))
.accumulate(lambda a,x:x+(a if a else Counter())+Counter({'states':1}))
.flatmap(lambda x:list(x.items()))
.foreach(lambda x:execute('HSET','nd',x[0],x[1]))
.register('sd:*:delta')