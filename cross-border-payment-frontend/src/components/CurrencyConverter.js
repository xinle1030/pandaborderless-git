import React, { useState, useEffect } from 'react';

import {
  Badge,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from '@chakra-ui/react';

function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState('');
  const fxRate = async (fromCurrency, toCurrency) => {
    let rate;
    if (fromCurrency !== toCurrency) {
      var myHeaders = new Headers();
      myHeaders.append('apikey', process.env.REACT_APP_EXCHANGE_RATE_API_KEY);

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
      };

      await fetch(
        `https://api.apilayer.com/currency_data/live?source=${fromCurrency}&currencies=${toCurrency}`,
        requestOptions
      )
        .then(response => response.json())
        .then(result => {
          rate = result.quotes[`${fromCurrency}${toCurrency}`];
        })
        .catch(error => console.log('error', error));
    }
    return rate;
  };

  useEffect(() => {
    async function getRate() {
      const rate = await fxRate('SGD', 'MYR');
      setExchangeRate(rate);
      setConvertedAmount(amount * exchangeRate);
    }

    getRate();
  }, []);

  useEffect(() => {
    setConvertedAmount(amount * exchangeRate);
  }, [amount, exchangeRate]);

  const handleChange = event => {
    setAmount(parseFloat(event.target.value));
  };

  return (
    <Flex
      position={'relative'}
      flexDirection={'column'}
      height={'300px'}
      rounded={'2xl'}
      boxShadow={'2xl'}
      width={'full'}
      overflow={'hidden'}
      bg="white"
      p={4}
    >
      <InputGroup mb={2}>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children="$"
          height={'100%'}
        />
        <Input
          placeholder="You send"
          size="lg"
          onChange={handleChange}
          defaultValue={amount}
          value={amount}
        />
        <Select defaultValue={'SGD'} size="lg" ml={'2'} w={'50%'}>
          <option value="MYR">MYR 🇲🇾</option>
          <option value="USD">USD 🇺🇸</option>
          <option value="SGD">SGD 🇸🇬</option>
          <option value="KHR">KHR 🇰🇭</option>
        </Select>
      </InputGroup>

      <InputGroup mb={2}>
        <InputLeftElement
          height={'100%'}
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children="$"
        />
        <Input placeholder="Recipient gets" size="lg" value={convertedAmount} />
        <Select defaultValue={'MYR'} size="lg" ml={'2'} w={'50%'}>
          <option value="MYR">MYR 🇲🇾</option>
          <option value="USD">USD 🇺🇸</option>
          <option value="SGD">SGD 🇸🇬</option>
          <option value="KHR">KHR 🇰🇭</option>
        </Select>
      </InputGroup>

      <Badge variant="subtle" colorScheme="gray" width={'fit-content'} mb={'2'}>
        Rate: 1 SGD = {exchangeRate} MYR
      </Badge>

      <Button
        colorScheme="secondary"
        size="lg"
        variant="solid"
        rounded={'full'}
        width="full"
      >
        Get Started
      </Button>
    </Flex>
  );
}

function CurrencyConverterClean() {
  const [amount, setAmount] = useState(1000);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState('');
  const fxRate = async (fromCurrency, toCurrency) => {
    let rate;
    if (fromCurrency !== toCurrency) {
      var myHeaders = new Headers();
      myHeaders.append('apikey', process.env.REACT_APP_EXCHANGE_RATE_API_KEY);

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
      };

      await fetch(
        `https://api.apilayer.com/currency_data/live?source=${fromCurrency}&currencies=${toCurrency}`,
        requestOptions
      )
        .then(response => response.json())
        .then(result => {
          rate = result.quotes[`${fromCurrency}${toCurrency}`];
        })
        .catch(error => console.log('error', error));
    }
    return rate;
  };

  useEffect(() => {
    async function getRate() {
      const rate = await fxRate('SGD', 'MYR');
      setExchangeRate(rate);
      setConvertedAmount(amount * exchangeRate);
    }

    getRate();
  }, []);

  useEffect(() => {
    setConvertedAmount(amount * exchangeRate);
  }, [amount, exchangeRate]);

  const handleChange = event => {
    setAmount(parseFloat(event.target.value));
  };

  return (
    <>
      <InputGroup mb={2}>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children="$"
          height={'100%'}
        />
        <Input
          placeholder="You send"
          size="lg"
          onChange={handleChange}
          defaultValue={amount}
          value={amount}
        />
        <Select defaultValue={'SGD'} size="lg" ml={'2'} w={'50%'}>
          <option value="SGD">SGD 🇸🇬</option>
          <option value="USD">USD 🇺🇸</option>
          <option value="MYR">MYR 🇲🇾</option>
          <option value="KHR">KHR 🇰🇭</option>
        </Select>
      </InputGroup>

      <InputGroup mb={2}>
        <InputLeftElement
          height={'100%'}
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children="$"
        />
        <Input placeholder="Recipient gets" size="lg" value={convertedAmount} />
        <Select defaultValue={'MYR'} size="lg" ml={'2'} w={'50%'}>
          <option value="MYR">MYR 🇲🇾</option>
          <option value="USD">USD 🇺🇸</option>
          <option value="SGD">SGD 🇸🇬</option>
          <option value="KHR">KHR 🇰🇭</option>
        </Select>
      </InputGroup>

      <Badge variant="subtle" colorScheme="gray" width={'fit-content'} mb={'2'}>
        Rate: 1 SGD = {exchangeRate} MYR
      </Badge>
    </>
  );
}

export { CurrencyConverter, CurrencyConverterClean };
