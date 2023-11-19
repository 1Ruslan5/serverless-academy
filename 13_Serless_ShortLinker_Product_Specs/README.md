# SHORT LINKER

This project is directed to create a back end functional for 'Short linker' on AWS. This project contains sign in and sign up for the user. Authorized users can use function for short their link with different time of live, view all their created links and short information on this link, also he can deactivate any working link. Any can use short link and every time when someone uses link information about use it saving in counter of links.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and deploy](#installation-and-deploy)
- [Project Structure](#project-structure)
- [OpenApi](#openapi)

## Getting Started

### Prerequisites

Before started to deploy the project you need to create AWS account, intall AWS CLI and authorize in CLI. Also in project using SES(Simple Email Service), it's working in sandbox mode and all project is created for them therefore you need to create verified identities which send email and get email from service.

### Installation and deploy

1.Let's start, fist what we need to install all project from my GitHub repository:
```bash
git clone https://github.com/1Ruslan5/serverless-academy/tree/main/13_Serless_ShortLinker_Product_Specs
```

2.After you shoud move to this project. Example:
```bash
cd C:/serverless-academy/13_Serless_ShortLinker_Product_Specs
```

3.Now you have all project, after you need to install what is containing in package.json:
```bash
npm install
```

4.After all of installation you have full project, but you don't can run it or diploy because you shoud indicate some own parametrs of AWS in .sample.env:
```
CLIENT_ID = 
CLIENT_SECRET = 
USER_POOL_ID = 
SECRET_KEY = 
SES_EMAIL = 
```
After that you need to change in serverless.yml path of file env:
```
custom:
  autoswagger:
    typefiles: ['./src/models/types-swager/UserType.d.ts', './src/models/types-swager/LinkType.d.ts']
    basePath: '/shortLink'

  dotenv:
    path: "./.sample.env"
```

5.Now you can deploy this project on your own AWS account:
```bash
serverless deploy
```

6.That check of programmability, if you have some problam you can use command:
```
serverless offline start --stage shortLink
```
This comand is start you project on you pc and you can easier check any exeption

## Project Structure

The project is structured as follows:

- **`src/`**: This directory contains the source code of the application.
  - **`controllers/`**: Holds the controller logic for handling requests.
    - **`links/`**: Contains all endpoints which are related to links.
    - **`users/`**: Holds all endpoints which are related to users.
  - **`models/`**: Includes data models.
    - **`types-swagger`**: Contains data models for swagger type. 
  - **`services/`**: Includes services of AWS. 
  - **`utils/`**: Contains custom utils for make it easier.
    - **`link`**: Holds function weach using in this project for work with links.
    - **`responses`**: Contains utils for responses.
    - **`tokens`**: Contains utils for work with token.
    - **`validation`**: Holds function using for validate data.


- **`.gitignore`**: Specifies files and directories that should be ignored by comit to repository.

- **`package-lock.json`**: Lists project dependencies and includes npm scripts.

- **`package.json`**: Lists project dependencies and includes npm scripts for various tasks.

- **`README.md`**: The main documentation file providing information about the project, including how to install, deploy, project structure and OpenAPI.

- **`serverless.yml`**: Configuration file used by the Serverless Framework. It defines the AWS Lambda functions, events, ... Also it allows to specify deployment settings and environment variables.

- **`tsconfig.json`**: The TypeScript configuration file. It contains settings and options for the TypeScript compiler.

- **`tsconfig.path.json`**: Custom TypeScript configuration file used to manage path aliases in TypeScript project.

## OpenAPI

Structur of my requests and check how their working you can look at my OpenApi swagger: https://5yid1denjd.execute-api.eu-central-1.amazonaws.com/swagger