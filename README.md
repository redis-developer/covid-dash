# covid-dash

Covid-19 Dashboard for India made using Redis Server, Redis JSON, and Redis Gears.

## The Why

- Unified portal for daily and all-time data
- Compare the data between various states and union territorries
- Display the data over time
- Uses the official ( Ministry of Health and Welfare ) and the unofficially crowdsourced ( covid19india.org ) data
- Give information regarding vaccinations

India's COVID-19 rate is rapidly climbing. This dashboard aims to provide a holistic outlook of the data.

I could not complete this project in time for the hackathon,currently the server sets, updates, and cleans the data it recieves from various APIs into Redis with various modules.

## Run It

### Express Server

Use `npm run start` to start the server\
Use `npm run dev` to start dev environment and use `docker-compose up -d` (see below).

- `/api/set/daily` updates the daily national and statewise data
- `/api/set/total` updates the all-time data
- `/api/set/timeseries` updates the all-time timeseries data for each state
- `.\config.json` contains the configurations for the redis database to connect to

### Redis

For a local redis database docker desktop is required.\
Run `docker-compose up -d` in this folder to spin it up.

The Redis keys are split into parts:

- `st:`, `sd:`, `nt:`, `nd:` contains the state total, state daily, national total, national daily values, respectively.
- `:delta:` and `:delta7:` parts are present for daily keys, they contain the daily and 7 day average data respectively.
- `:LK`, `:KL`, etc are the last part of key, they are the state/union territorry ISO 3166-2:IN codes a.k.a just short-forms.\
  The list of codes to full names are present in `.\utils\stuff.json`
- The database also contains all-time timeseries and more

### Upcoming Features

- Use Redis AI to create and update data predictions according to incoming data.
- Rich command line application to display data with something like
  `curl -s covid-dash.com/run.sh | bash`
