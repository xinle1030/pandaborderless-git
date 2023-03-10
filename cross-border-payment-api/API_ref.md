## Backend

### API Reference

### index.js

```http
  GET /
```

**Response:**

"Welcome to cross border payment platform"

### auth.js

```http
  POST /api/auth/signup
```

| Request Body | Type     |
| :----------- | :------- |
| `username`   | `String` |
| `email`      | `String` |
| `password`   | `String` |

```
  POST /api/auth/signin
```

| Request Body | Type     |
| :----------- | :------- |
| `username`   | `String` |
| `password`   | `String` |

**Response:**

```
{
  id: user._id,
  username: "string",
  email: "string",
  accessToken: "string",
}
```

### account.js

```http
  POST /api/account
```

- Must login for creating your bank account along with wallet address
  by adding a header called "x-access-token" with value = accessToken that is given to you when sign in

| Request Body | Type     |
| :----------- | :------- |
| `email`      | `String` |
| `currency`   | `String` |

**Response:**

```
{
  accountNumber: "string",
  walletAdrHash: "string",
  walletPKHash: "string",
  balance: number,
  ownerId: "string",
  currency: "string",
}
```

```http
  GET /api/account/:accountNumber
```

- Must login for viewing your bank account details
  by adding a header called "x-access-token" with value = accessToken that is given to you when sign in

| Parameter       | Type     | Description         |
| :-------------- | :------- | :------------------ |
| `accountNumber` | `string` | Bank account number |

**Response:**

```
{
  accountNumber: "string",
  walletAdrHash: "string",
  walletPKHash: "string",
  balance: number,
  ownerId: "string",
  currency: "string",
}
```

```http
  GET /api/account/:accountNumber/transaction
```

- Must login for viewing transactions that your bank account has made
  by adding a header called "x-access-token" with value = accessToken that is given to you when sign in

| Parameter       | Type     | Description         |
| :-------------- | :------- | :------------------ |
| `accountNumber` | `string` | Bank account number |

**Response:**

```
[{
      accountFrom: "AccountId",
      accountTo: "AccountId",
      transactionAmount: number,
      timestamp: "string",
      meta: {
        currency: "string",
        txnHash1: "string",
        txnHash2: "string",
        fxRate1: "string",
        fxRate2: "string"
      },
}]
```

```http
  PUT /api/account/transfer
```

- Must login for transferring money
  by adding a header called "x-access-token" with value = accessToken that is given to you when sign in

| Request Body       | Type     | Description        |
| :----------------- | :------- | :----------------- |
| `accountFrom`      | `string` | sender's account   |
| `accountTo`        | `string` | receiver's account |
| `amountToTransfer` | `int`    | value to transfer  |

**Response:**

```
{
      accountFrom: "AccountId",
      accountTo: "AccountId",
      transactionAmount: number,
      timestamp: "string",
      meta: {
        currency: "string",
        txnHash1: "string",
        txnHash2: "string",
        fxRate1: "string",
        fxRate2: "string"
      },
}
```

### customer.js

```http
  GET /api/customer
```

- Must login to view a customer details
  by adding a header called "x-access-token" with value = accessToken that is given to you when sign in

**Response:**

```
{
  _id: string,
  username: string,
  email: string,
  password: "string",
  accounts: [
    {
      accountNumber: "string",
      walletAdrHash: "string",
      walletPKHash: "string",
      balance: number,
      ownerId: "string",
      currency: "string",
    }
  ]
}
```

### transaction.js

```http
  GET /api/transaction/all
```

**Response:**

```
[{
      accountFrom: "AccountId",
      accountTo: "AccountId",
      transactionAmount: number,
      timestamp: "string",
      meta: {
        currency: "string",
        txnHash1: "string",
        txnHash2: "string",
        fxRate1: "string",
        fxRate2: "string"
      },
}]
```

```http
  GET /api/transaction/:transactionHash
```

| Parameter         | Type     | Description      |
| :---------------- | :------- | :--------------- |
| `transactionHash` | `string` | Transaction Hash |

**Response:**

```
{
      accountFrom: "AccountId",
      accountTo: "AccountId",
      transactionAmount: number,
      timestamp: "string",
      meta: {
        currency: "string",
        txnHash1: "string",
        txnHash2: "string",
        fxRate1: "string",
        fxRate2: "string"
      },
}
```
