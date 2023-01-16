# DeFi Cross Border Payment Platform - PandaBorderless

This is a monorepo containing 1 project as follows:
- backend API

## Deployment
- Backend (using ): 

## Backend

### Set up hyperledger besu
- Download the Besu packaged binaries at this link, https://github.com/hyperledger/besu/releases", choose 22.10.3 version

## Environment Variables
To run this project, you will need to add the following environment variables to your `.env` file under ./cross-border-payment-api/config

| Variable                       | Description                                                                                |
| :----------------------------- | :----------------------------------------------------------------------------------------- |
| `DB`                           | Mongodb URI to connect the application to mongodb cluster                                  |
| `pdcContractAddress`           | deployed panda coin contract address                                                       |
| `fXContractAddr`               | deployed currency exchange contract address                                                |
| `INFURA_API_KEY`               | API Key for Infura                                                                         |
| `MNEMONIC`                     | Mnemonic for your account                                                                  |

### Set up connection to MongoDB
- Create a project and cluster on MongoDB

### Use Local Network (Ganache)
#### Set up the network using Ganache
- Clone the project
- Install NodeJS **LTS** version from <a href="https://nodejs.org/en/download/">NodeJs Official Page</a>
- Download the product on this page
- Unzip the downloaded file to a folder in your computer
- Download Ganache from https://trufflesuite.com/ganache/
- Open Editor Terminal
- Go to ./cross-border-payment-api folder
- Run in terminal `npm install nodemon -g`
- Run in terminal `npm install truffle -g`
- Go back to the previous terminal and run ```truffle compile``` to compile contract
- Then run ```npm run besu```
- Then run ```truffle migrate --network besu``` to create migrations to deploy migrations and wallet on besu network
- Then run ```truffle test --network besu```

#### Set up server locally
- Under ./cross-border-payment-api/config/.env, put in ```pdcContractAddress={deployed panda coin contract address}``` and ```fXContractAddr={deployed currency exchange contract address}```
- Then under ./cross-border-payment-api/config, create a file called secrets.js, put in 
```const privateKeys = [{PK1},{PK2},{PK3}]; module.exports = privateKeys;```
- Then under ./cross-border-payment-api/config, create a file called auth.config.js, put in 
```module.exports = {secret: {any secret key to encode user account password}};```
- Run in terminal `npm install`
- Then run `npm start`
- Navigate to https://localhost:3333

### Use Goerli Testnet


### Setting up the server on EC2
- Then run `pm2 -- panda npm -- start` instead of `npm start`
- Navigate to http://{public IP OR DNS}


### API Paths
Refer to README.md under ./cross-border-payment-api