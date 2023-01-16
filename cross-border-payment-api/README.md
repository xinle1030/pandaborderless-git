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

| Request Body    | Type                  |
| :---------------| :-------------------- |
| `username`      | `String`              |
| `email`         | `String`              |
| `password`      | `String`              |

```
  POST /api/auth/signin
```

| Request Body    | Type                  |
| :---------------| :-------------------- |
| `username`      | `String`              |
| `password`      | `String`              |

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

| Request Body    | Type                  |
| :---------------| :-------------------- |
| `email`         | `String`              |
| `currency`      | `String`              |

**Response:**
```
{
  accountNumber: "string",
  walletAdrHash: "string",
  walletPKHash: "string",
  balance: number,
  ownerId: "CustomerId",
  currency: "string",
}
```

```http
  GET /api/account/:accountNumber
```

- Must login for viewing your bank account details
 by adding a header called "x-access-token" with value = accessToken that is given to you when sign in

| Parameter             | Type     | Description         |
| :--------             | :------- | :--------------     |
| `accountNumber`       | `string` | Bank account number |

**Response:**
```
{
  accountNumber: "string",
  walletAdrHash: "string",
  walletPKHash: "string",
  balance: number,
  ownerId: "CustomerId",
  currency: "string",
}
```

### payments.js

...


### transaction.js
```http
  GET /api/transaction
```
**Response:**
```
{
  [{
      accountFrom: "string",
      accountTo: "string",
      transactionAmount: number,
      timestamp: "string",
      meta: {
        currency: "string",
        transactionHash: "string",
      },
  }]
}
```

```http
  GET /api/transaction/:transactionHash
```

| Parameter               | Type     | Description      |
| :--------               | :------- | :--------------  |
| `transactionHash`       | `string` | Transaction Hash |

**Response:**
```
{
      accountFrom: "string",
      accountTo: "string",
      transactionAmount: number,
      timestamp: "string",
      meta: {
        currency: "string",
        transactionHash: "string",
      },
}
```