# Retriever Dashboard - Backend
Order monitoring dashboard for tracking equipment returns.

## Description
This application utilizes the Retriever API to monitor placed orders, and their current shipping status. Retriever is a service utilized by companies for the retrieval of company equipment from employees. This dashboard aids with tracking, follow up, and evaulation of ROI with the Retriever service.

## Built With

* Nodejs
* Express
* Redis
* Cors
* Dotenv
* Node-Cron
* Node-Fetch

## Getting Started

### Installation

```
git@github.com:Fabio0329/retriever_dashboard-backend.git
```
```
cd [cloned directory]; npm install
```

### Setup
* [Redis](https://redis.io/) is used for data caching, and runs on default settings for this application. Once installed, Redis can be spun up and managed via CLI with the following commands
```
redis-server "spins up a redis server"
```
```
redis-cli "provides cli access to redis server"
```
* This application requires an account and paid service with [Retriever](https://helloretriever.com/) at which time an API key is issued
* In the root directory of the project, create a .env file and update it with your API key in the following format
```
REACT_APP_MOVIE_API = <API KEY>
```

### Executation

```
node index.js
```

## Authors

* Fabio Restrepo

## Acknowledgments

* [Retriever](https://helloretriever.com/)
