# Usage instructions

## Setup explorer
1. git clone https://github.com/OneGraph/graphiql-explorer-example
2. cd graphiql-explore-example
3. yarn install
4. yarn start
5. on localhost:3000 play with OneGraph data

## Change graphql endpoint to datasource demo

1. Replace `https://serve.onegraph.com/dynamic?app_id=c333eb5b-04b2-4709-9246-31e18db397e1` with url that looks like following `https://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev/graphql` in src/App.js
2. And make `const DEFAULT_QUERY` in src/App.js be following

```
const DEFAULT_QUERY = `{
  taxis {
    company(companyId: "02655284") {
      companyName
     }
   }
 }`;
```
3. yarn start
4. on localhost:3000 play with dsdemo data

## Deploy your own dsdemo project on AWS (first configure your serverless environment)

1. clone this repo
2. cd to repo
3. yarn install
4. sls deploy
5. in graphiql-explorer-example replace endpoint with your new just deployed api
6. run yarn start in graphiql-explorer-example
7. play with data
8. you are now using crawler from your own aws account

