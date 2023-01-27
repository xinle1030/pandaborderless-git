import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputGroup,
  Text,
  FormHelperText,
  InputLeftElement,
  Badge,
  useColorModeValue,
  StackDivider,
  Stack,
  Container,
  Grid,
  GridItem,
  Link,
  Checkbox,
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';
import {
  ArrowDownIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import Confetti from '../components/Confetti';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const DataContext = createContext({});
const UserDataContext = createContext({});

const VerificationForm = () => {
  const { data, setData } = useContext(DataContext);
  const { userData, setUserData } = useContext(UserDataContext);

  const onHandle = e => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  };

  const onHandleSenderAccountNumber = e => {
    setData({ ...data, ['senderAccountNumber']: e.target.value });
  };

  return (
    <>
      {Object.entries(userData).length !== 0 ? (
        <>
          <Heading w="100%" textAlign={'center'} fontWeight="bold" mb="4">
            Step 1: Select your account
          </Heading>
          <Select
            id="senderAccountNumber"
            onChange={onHandleSenderAccountNumber}
            size="lg"
          >
            {Object.entries(userData).length === 0 ? (
              <option value="0">No account found</option>
            ) : (
              userData.accounts.map((account, index) => (
                <option key={index} value={account.accountNumber}>
                  {account.accountNumber} {account.walletAdrHash.substr(0, 6)}
                  ...
                  {account.walletAdrHash.substr(-6)}
                </option>
              ))
            )}
          </Select>
        </>
      ) : (
        <>
          {' '}
          <Heading w="100%" textAlign={'center'} fontWeight="bold" mb="4">
            Step 1: User Verification
          </Heading>
          <FormControl mr="5%">
            <FormLabel htmlFor="firstName" fontWeight={'normal'}>
              First name
            </FormLabel>
            <Input
              id="sFirstName"
              placeholder="First name"
              type="text"
              value={data.sFirstName}
              onChange={onHandle}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastName" fontWeight={'normal'}>
              Last name
            </FormLabel>
            <Input
              id="sLastName"
              placeholder="Last name"
              value={data.sLastName}
              onChange={onHandle}
            />
          </FormControl>
          <Flex mt="2%">
            <FormControl mr="5%">
              <FormLabel htmlFor="occupation" fontWeight={'normal'}>
                Occupation
              </FormLabel>
              <Input
                id="sOccupation"
                placeholder="Occupation"
                value={data.sOccupation}
                onChange={onHandle}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="sourceOfFunds" fontWeight={'normal'}>
                Source of funds
              </FormLabel>
              <Input
                id="sSourceOfFunds"
                placeholder="Source of funds"
                value={data.sSourceOfFunds}
                onChange={onHandle}
              />
            </FormControl>
          </Flex>
          <FormControl mt="2%">
            <FormLabel htmlFor="purposeOfTransfer" fontWeight={'normal'}>
              Purpose of transfer
            </FormLabel>
            <Input
              id="sPurposeOfTransfer"
              value={data.sPurposeOfTransfer}
              onChange={onHandle}
            />
          </FormControl>
          <FormControl mt="2%">
            <FormLabel id="email" htmlFor="email" fontWeight={'normal'}>
              Email address
            </FormLabel>
            <Input
              id="sEmail"
              type="email"
              value={data.sEmail}
              onChange={onHandle}
            />
            <FormHelperText>We'll never share your email.</FormHelperText>
          </FormControl>
        </>
      )}
    </>
  );
};

const CurrencyExchange = () => {
  const [amount, setAmount] = useState(100);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0.24);
  const { data, setData } = useContext(DataContext);

  useEffect(() => {
    setConvertedAmount(amount * exchangeRate);
    setData({ ...data, ['sendAmount']: '100' });
  }, [amount, exchangeRate]);

  const onHandle = e => {
    const { id, value } = e.target;
    setAmount(e.target.value);
    setData({ ...data, [id]: value });
  };

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="bold" mb="4">
        Step 2: Enter Amount and Select Currency
      </Heading>

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
          id="sendAmount"
          onChange={onHandle}
          value={amount}
        />
        <Select defaultValue={'MYR'} size="lg" ml={'2'} w={'50%'}>
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
        <Select defaultValue={'USD'} size="lg" ml={'2'} w={'50%'}>
          <option value="USD">USD 🇺🇸</option>
          <option value="MYR">MYR 🇲🇾</option>
          <option value="SGD">SGD 🇸🇬</option>
          <option value="KHR">KHR 🇰🇭</option>
        </Select>
      </InputGroup>

      <Badge variant="subtle" colorScheme="gray" width={'fit-content'} mb={'2'}>
        Rate: 1 MYR = 0.24 USD
      </Badge>
    </>
  );
};

const RecipientInfo = () => {
  const { data, setData } = useContext(DataContext);
  const onHandle = e => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  };
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="bold" mb="4">
        Step 3: Recipient Information
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl mt="2%">
          <Heading size="md"> Recipient Account Info </Heading>

          <FormLabel htmlFor="accountNumber">Account Number</FormLabel>
          <Input
            id="recipientAccountNumber"
            value={data.recipientAccountNumber}
            onChange={onHandle}
          />
        </FormControl>
        <FormControl mt="2%">
          <Heading size="md"> Recipient Other Info </Heading>
          <Flex>
            <FormControl mr="5%">
              <FormLabel htmlFor="rFirstName" fontWeight={'normal'}>
                First name
              </FormLabel>
              <Input
                id="rFirstName"
                placeholder="First name"
                value={data.rFirstName}
                onChange={onHandle}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="rLastName" fontWeight={'normal'}>
                Last name
              </FormLabel>
              <Input
                id="rLastName"
                placeholder="Last Name"
                value={data.rLastName}
                onChange={onHandle}
              />
            </FormControl>
          </Flex>
          <FormHelperText>
            * Please enter the recipient's full name. e.g. John Doe (not J Doe)
          </FormHelperText>
          <FormLabel htmlFor="rMobileNumber">Mobile Number</FormLabel>
          <Input
            id="rMobileNumber"
            value={data.rMobileNumber}
            onChange={onHandle}
          />
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input id="rAddress" value={data.rAddress} onChange={onHandle} />
          <FormLabel htmlFor="address">Province</FormLabel>
          <Input id="rProvince" value={data.rProvince} onChange={onHandle} />
          <FormLabel htmlFor="address">City</FormLabel>
          <Input id="rCity" value={data.rCity} onChange={onHandle} />
        </FormControl>
      </SimpleGrid>
    </>
  );
};

const Summary = () => {
  const { data, setData } = useContext(DataContext);
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="bold" mb="4">
        Transaction Summary
      </Heading>
      <Container maxW={'7xl'}>
        <SimpleGrid spacing={{ base: 8, md: 10 }}>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Stack
              spacing={{ base: 12, sm: 6 }}
              direction={'column'}
              divider={
                <StackDivider
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                />
              }
            >
              <Box textAlign="center" pt={4} px={6}>
                <InfoIcon boxSize={'50px'} color={'blue.500'} />
                <Heading as="h2" size="lg" mt={6} mb={2}>
                  Re-check the details & confirm transfer request.
                </Heading>
              </Box>
              <Box>
                <Badge
                  variant="subtle"
                  colorScheme="gray"
                  width={'fit-content'}
                  mb={'2'}
                >
                  Rate: 1 MYR = 0.24 USD
                </Badge>
                <SimpleGrid columns={{ base: 2 }}>
                  <Text fontSize={'xl'} fontWeight="bold">
                    MYR 🇲🇾
                  </Text>
                  <Text fontSize={'xl'} textAlign="end" f fontWeight="bold">
                    100
                  </Text>
                  <ArrowDownIcon
                    fontSize={'xl'}
                    my={2}
                    ms={4}
                    color="primary.600"
                  />
                  <Text />
                  <Text fontSize={'xl'} fontWeight="bold">
                    USD 🇺🇸
                  </Text>
                  <Text fontSize={'xl'} textAlign="end" fontWeight="bold">
                    24
                  </Text>
                </SimpleGrid>
              </Box>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={useColorModeValue('primary', 'primary.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Recipient Information
                </Text>
                <Grid gap={2} templateColumns="repeat(2, 1fr)">
                  <GridItem colSpan={2} mb={2}>
                    <Text fontSize={'sm'}>Account Number</Text>
                    <Text fontWeight="bold">{data.rAccountNumber}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={'sm'}>First name</Text>
                    <Text fontWeight="bold">{data.rFirstName}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={'sm'}>Last name</Text>
                    <Text fontWeight="bold">{data.rLastName}</Text>
                  </GridItem>
                  <GridItem colSpan={2} mb={2}>
                    <Text fontSize={'sm'}>Mobile Number</Text>
                    <Text fontWeight="bold">{data.rMobileNumber}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={'sm'}>Address</Text>
                    <Text fontWeight="bold">{data.rAddress}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={'sm'}>Province</Text>
                    <Text fontWeight="bold">{data.rProvince}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize={'sm'}>City</Text>
                    <Text fontWeight="bold">{data.rCity}</Text>
                  </GridItem>
                </Grid>
              </Box>
              <FormControl>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={useColorModeValue('primary', 'primary.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Confirmation
                </Text>

                <Checkbox
                  colorScheme={'red'}
                  w="full"
                  p="4"
                  borderColor="white"
                  bg="red.200"
                  rounded="8"
                  color="red.900"
                >
                  I have confirmed the above information and agree to make the
                  transaction.
                </Checkbox>
                <FormHelperText>
                  * Additional information & documents may be requested by our
                  local partner.
                </FormHelperText>
              </FormControl>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </>
  );
};

const TransactionCompleted = () => {
  const { data, setData } = useContext(DataContext);
  return (
    <Container display="flex" maxW={'7xl'} flexDirection={'column'}>
      <Confetti />
      <Box textAlign="center" py={4} px={6}>
        <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
        <Heading as="h2" size="lg" mt={6} mb={2}>
          Transaction successfully completed.
        </Heading>
        Check your transaction here:
        <Text></Text>
        <Text textAlign={'text-top'}>
          <Link
            textDecoration={'underline'}
            color={'teal.500'}
            href={`https://goerli.etherscan.io/tx/${data.meta.txnHash1}`}
            target="_blank"
            isExternal
            rel="noopener noreferrer"
          >
            {data.meta.txnHash1}
            <ExternalLinkIcon verticalAlign={'text-top'} ms={1} />
          </Link>
        </Text>
      </Box>
      <Link mx="auto" textAlign={'center'} w="auto" as={RouterLink} to="/">
        Back to home
      </Link>
    </Container>
  );
};

export default function TransactionPage() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [data, setData] = useState({});
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/api/customer',
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error(data);
      } else {
        console.log(data);
        setUserData(data);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log(
        data.senderAccountNumber,
        data.recipientAccountNumber,
        parseInt(data.sendAmount)
      );

      const putData = {
        accountFrom: data.senderAccountNumber,
        accountTo: data.recipientAccountNumber,
        amountToTransfer: parseInt(data.sendAmount),
      };
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `/api/account/transfer`,
        putData,
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Success.',
          description: 'Transaction completed successfully.',
          status: 'success',
          isClosable: true,
        });
        console.log(response);
        setData(response.data);
        setStep(5);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error.',
        description: `An error occurred while processing your request. ${error.message}`,
        status: 'error',
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <DataContext.Provider value={{ data, setData }}>
      <UserDataContext.Provider value={{ userData, setUserData }}>
        <Box
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          p={6}
          mx="auto"
          my="10"
          as="form"
        >
          <Progress
            hasStripe
            value={progress}
            colorScheme="secondary"
            mb="5%"
            mx="5%"
            isAnimated
            display={step === 5 ? 'none' : 'block'}
          />
          {step === 1 ? (
            userData ? (
              <VerificationForm />
            ) : null
          ) : step === 2 ? (
            <CurrencyExchange />
          ) : step === 3 ? (
            <RecipientInfo />
          ) : step === 4 ? (
            <Summary />
          ) : (
            <TransactionCompleted />
          )}
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex>
                <Button
                  onClick={() => {
                    setStep(step - 1);
                    setProgress(progress - 25);
                  }}
                  display={(step === 1) | (step === 5) ? 'none' : 'block'}
                  colorScheme="secondary"
                  variant="outline"
                  w="7rem"
                  mr="5%"
                >
                  Back
                </Button>
                <Button
                  w="7rem"
                  display={(step === 4) | (step === 5) ? 'none' : 'block'}
                  onClick={() => {
                    setStep(step + 1);
                    if (step === 4) {
                      setProgress(100);
                    } else {
                      setProgress(progress + 25);
                    }
                  }}
                  colorScheme="secondary"
                  variant="solid"
                >
                  Next
                </Button>
              </Flex>
              {step === 4 ? (
                <Button
                  w="7rem"
                  colorScheme="green"
                  variant="solid"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              ) : null}
            </Flex>
          </ButtonGroup>
        </Box>
      </UserDataContext.Provider>
    </DataContext.Provider>
  );
}
