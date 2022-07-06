#  mx-beerhouse-ghost-inspector-webhooks
Project to take care of provisioning the scenarios for the ghost inspector tests. It also has enpoints to execute certain operations during the execution of the Ghost inspector and Postman tests.


## Description
This project will provision the scenarios for the tests as well as clean up these scenarios, as well as coordinate the tests so that they run in the correct order.


## features
* Custom built for Beerhouse tests
* Provisioning a Beerhouse account for different scenarios.
* Integration with ghost inspector
* Crons to run ghost inspector suites
* Serverless offline to test the api gateway localy

## Installation

* Install & Configure serverless framework, Guide [here](https://serverless.com/framework/docs/getting-started/)

* Install & Configure serverless-offline, Guide [here](https://www.serverless.com/plugins/serverless-offline#installation)

* Clone this repo and run `npm install`

* Set up the environment variables running `export $(xargs < .env)` in the main dir


## Test locally

* `npm run dev` will run api gateway locally in your machine on port `3000` so you can test the function as it on AWS api gateway

* POST `/webhook/delete-subs` in order to delete all subscriptions

* POST `/webhook/add-mp-payment-method` in order to add a valid Mercado Pago payment method


## Contribution

Feel free to fork, commit and submit pull request if you find a bug. Contributions are very welcome.
