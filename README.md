# Simon Says

## Requirements

NodeJS and Python (Optional).

## Instructions

### Run back-end service

**From `/backend` folder:**

1. Run with typescript (First time to create *.js files):

Install packages: 

`npm i`

Run dev script: 

`npm run dev`

**Note that new folders should be created on `/backend/dist` folder**.

2. Run directly with node:

Once you use Typescript the first time. you can now run directly with node: 

`node /dist/server.js`

### Run front-end "service"

**From `/frontend` folder:**

1. Run with typescript (First time to create *.js files):

Install packages: 

`npm i`

Run dev script: 

`npm run dev`

**Note that new folders should be created on `/frontend/dist` folder**.

2. Serve a simple web server on `/dist` foler

```
cd /dist
python -m http.server 8080
```
