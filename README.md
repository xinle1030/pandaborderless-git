
# DeFi Cross Border Payment Platform - PandaBorderless
This is a monorepo containing 1 project as follows:
- backend API

## Deployment
- Backend (using): 

## Backend
### Set up hyperledger besu
- Download the Besu packaged binaries at this link, https://github.com/hyperledger/besu/releases", choose 22.10.3 version

## Environment Variables
To run this project, you will need to add the following environment variables to your `.env` file under ./cross-border-payment-api/config

| Variable                       | Description                                                                                |
| :----------------------------- | :----------------------------------------------------------------------------------------- |
| `DB`                           | Mongodb URI to connect the application to mongodb cluster                                  |
| `pdcContractAddress`           | deployed panda coin contract address                                                       |
| `INFURA_API_KEY`               | API Key for Infura                                                                         |
| `MNEMONIC`                     | Mnemonic for your account                                                                  |
| `PDC_OWNER_ACC`           	 | panda coin contract owner - which is stored as a bank acc on database - 9250               |
| `PEG_CURRENCY`                 | target currency to peg PDC onto                                                            |
| `EXCHANGE_RATE_API_KEY`        | API key for https://api.apilayer.com/exchangerates_data/convert			                |                                                       

### Set up connection to MongoDB
- Create a project and cluster on MongoDB

### Use Local Network (Ganache)
#### Set up the network using Ganache
1. Clone the project  
2. Install NodeJS **LTS** version from <a href="https://nodejs.org/en/download/">NodeJs Official Page</a>  
3. Download the product on this page  
4. Unzip the downloaded file to a folder in your computer  
5. Download Ganache from https://trufflesuite.com/ganache/  
6. Open Editor Terminal  
7. Go to ./cross-border-payment-api folder  
8. Run in terminal `npm install nodemon -g`  
9. Run in terminal `npm install truffle -g`  
10. Go back to the previous terminal and run ```truffle compile``` to compile contract  
11. Then run ```npm run besu```  
12. Then run ```truffle migrate --network besu``` to create migrations to deploy migrations and wallet on besu network  
13. Then run ```truffle test --network besu```  

#### Set up server locally
1. Under ./cross-border-payment-api/config/.env, put in ```pdcContractAddress={deployed panda coin contract address}``` and ```fXContractAddr={deployed currency exchange contract address}```
2. Then under ./cross-border-payment-api/config, create a file called secrets.js, put in 
```const privateKeys = [{PK1},{PK2},{PK3}]; module.exports = privateKeys;```
3. Then under ./cross-border-payment-api/config, create a file called auth.config.js, put in 
```module.exports = {secret: {any secret key to encode user account password}};```
4. Run in terminal `npm install`
5. Then run `npm start`
6. Navigate to https://localhost:3333

### Use Goerli Testnet
### Setting up the server on EC2
1. Clone the project  
2. Install NodeJS
	- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash` 
	- Once nvm is installed, close and reopen the terminal to activate nvm
	- `nvm install node`
	- To verify that Node.js, `node -v` 
3. Go to ./cross-border-payment-api folder  
4. Run in terminal `npm install nodemon -g`  
5. Run in terminal `npm install truffle -g`  
6. Run in terminal `npm install dotenv`  
7. Run in terminal `npm install pm2 -g`  
8. Go back to the previous terminal and run ```truffle compile``` to compile contract  
9. Then run ```truffle migrate --network goerli``` to create migrations to deploy migrations and wallet on besu network  
10. To start the service using pm2, run ```pm2 start npm --name "<app-name>" -- run build```  
11. Redirect port 80 to port 3333, `sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3333`  
12. Navigate to http://{public IP OR DNS}

### API Paths
Refer to README.md under ./cross-border-payment-api
