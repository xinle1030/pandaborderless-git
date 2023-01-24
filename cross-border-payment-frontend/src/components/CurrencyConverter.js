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

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0.786);

  useEffect(() => {
    setConvertedAmount(amount * exchangeRate);
  }, [amount, exchangeRate]);

  const handleChange = event => {
    setAmount(event.target.value);
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
      p={2}
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
        <Select defaultValue={'USD'} size="lg" ml={'2'} w={'50%'}>
          <option value="USD">USD 🇺🇸</option>
          <option value="SGD">SGD 🇸🇬</option>
          <option value="KHR">KHR 🇰🇭</option>
        </Select>
      </InputGroup>

      <Badge variant="subtle" colorScheme="gray" width={'fit-content'} mb={'2'}>
        Rate: 1 SGD = 0.786 USD
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
