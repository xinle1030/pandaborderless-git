import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Grid,
  GridItem,
  Box,
  Center,
  Text,
  Stack,
  List,
  ListItem,
  useColorModeValue,
  Link,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';

import AvatarWithRipple from '../components/AvatarWithRipple';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function UserPage() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [transactions, setTransactions] = useState([]);
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
        console.log(data);
      } else {
        setUserData(data);
        setAccountNumbers(data.accounts.map(account => account.accountNumber));
        const promises = accountNumbers.map(async accountNumber => {
          const response = await fetch(
            process.env.REACT_APP_API_URL +
              `/api/account/${accountNumber}/transaction`,
            {
              headers: {
                'x-access-token': accessToken,
              },
            }
          );
          const transactionsData = await response.json();
          return transactionsData;
        });
        const allTransactions = await Promise.all(promises);
        setTransactions(allTransactions);
      }
      setLoading(false);
    }
    fetchData();
  }, [accessToken, accountNumbers, userData]);

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} maxW="6xl" mx="auto">
        <GridItem colSpan={4} w="100%" p={4}>
          <Center py={6}>
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'md'}
              overflow={'hidden'}
            >
              <Stack
                textAlign={'center'}
                p={6}
                color={useColorModeValue('gray.800', 'white')}
                align={'center'}
                w="100%"
              >
                <Text
                  fontSize={'sm'}
                  fontWeight={500}
                  bg={useColorModeValue('green.50', 'green.900')}
                  p={2}
                  px={3}
                  color={'green.500'}
                  rounded={'full'}
                >
                  User Profile
                </Text>
                <AvatarWithRipple align="center" />
              </Stack>
              <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={8}>
                <List spacing={4} mb={4}>
                  <ListItem>
                    Username:<Text as="b"> {userData.username}</Text>
                  </ListItem>
                  <ListItem>
                    Email: <Text as="b"> {userData.email}</Text>
                  </ListItem>
                </List>
                {userData.accounts ? (
                  userData.accounts.map(account => (
                    <Accordion defaultIndex={0} allowToggle>
                      <AccordionItem key={account.accountNumber}>
                        <h2>
                          <AccordionButton px={0}>
                            <Box as="span" flex="1" textAlign="left">
                              Account Number: {account.accountNumber}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} px={0}>
                          Wallet Address Hash: <br />
                          <Link
                            textDecoration={'underline'}
                            color={'teal.500'}
                            href={`https://goerli.etherscan.io/address/${account.walletAdrHash}`}
                            target="_blank"
                            isExternal
                            rel="noopener noreferrer"
                          >
                            {account.walletAdrHash.substr(0, 6)}...
                            {account.walletAdrHash.substr(-6)}
                            <ExternalLinkIcon verticalAlign={'text-top'} />
                          </Link>
                          <br />
                          Wallet Public Key Hash: <br />
                          <Link
                            textDecoration={'underline'}
                            color={'teal.500'}
                            href={`https://goerli.etherscan.io/address/${account.walletPKHash}`}
                            target="_blank"
                            isExternal
                            rel="noopener noreferrer"
                          >
                            {account.walletPKHash.substr(0, 6)}...
                            {account.walletPKHash.substr(-6)}
                            <ExternalLinkIcon verticalAlign={'text-top'} />
                          </Link>
                          <br />
                          Balance: {account.balance}
                          <br />
                          Currency: {account.currency}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  ))
                ) : (
                  <Text>No account found</Text>
                )}
              </Box>
            </Box>
          </Center>
        </GridItem>
        <GridItem colSpan={8} w="100%" p={4}>
          <Center py={6} h="100%">
            <Box
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'md'}
              h="100%"
              overflow={'hidden'}
            >
              <Box pt="4">
                <Text
                  fontSize={'sm'}
                  textAlign={'center'}
                  fontWeight={500}
                  bg={useColorModeValue('green.50', 'green.900')}
                  p={2}
                  px={3}
                  color={'green.500'}
                  rounded={'full'}
                  w="fit-content"
                  mx="auto"
                  my="2"
                >
                  Transactions (Account)
                </Text>
              </Box>
              <Tabs variant="soft-rounded">
                <TabList ps="4">
                  {accountNumbers.map((accountNumber, index) => (
                    <Tab key={accountNumber}>{accountNumber}</Tab>
                  ))}
                </TabList>

                <TabPanels>
                  {accountNumbers.map((account, index) => (
                    <TabPanel p="2" key={account.accountNumber}>
                      <TableContainer
                        sx={{ '::-webkit-scrollbar': { display: 'none' } }}
                      >
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th>From</Th>
                              <Th>To</Th>
                              <Th>Txn Amount</Th>
                              <Th>Currency</Th>
                              <Th>Txn Hash 1</Th>
                              <Th>Txn Hash 2</Th>
                              <Th>FX Rate 1</Th>
                              <Th>FX Rate 2</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {transactions &&
                              transactions[index] &&
                              transactions[index].length > 0 &&
                              transactions[index].map(transaction => (
                                <Tr key={transaction.timestamp}>
                                  <Td>
                                    <Link
                                      textDecoration={'underline'}
                                      color={'teal.500'}
                                      href={`https://goerli.etherscan.io/address/${transaction.accountFrom}`}
                                      target="_blank"
                                      isExternal
                                      rel="noopener noreferrer"
                                    >
                                      {transaction.accountFrom.substr(0, 6)}...
                                      {transaction.accountFrom.substr(-6)}
                                    </Link>
                                  </Td>
                                  <Td>
                                    <Link
                                      textDecoration={'underline'}
                                      color={'teal.500'}
                                      href={`https://goerli.etherscan.io/address/${transaction.accountTo}`}
                                      target="_blank"
                                      isExternal
                                      rel="noopener noreferrer"
                                    >
                                      {transaction.accountTo.substr(0, 6)}...
                                      {transaction.accountTo.substr(-6)}
                                    </Link>
                                  </Td>
                                  <Td>{transaction.transactionAmount}</Td>
                                  <Td>{transaction.meta.currency}</Td>
                                  <Td>
                                    <Link
                                      textDecoration={'underline'}
                                      color={'teal.500'}
                                      href={`https://goerli.etherscan.io/tx/${transaction.meta.txnHash1}`}
                                      target="_blank"
                                      isExternal
                                      rel="noopener noreferrer"
                                    >
                                      {transaction.meta.txnHash1.substr(0, 6)}
                                      ...
                                      {transaction.meta.txnHash1.substr(-6)}
                                    </Link>
                                  </Td>
                                  <Td>
                                    <Link
                                      textDecoration={'underline'}
                                      color={'teal.500'}
                                      href={`https://goerli.etherscan.io/tx/${transaction.meta.txnHash2}`}
                                      target="_blank"
                                      isExternal
                                      rel="noopener noreferrer"
                                    >
                                      {transaction.meta.txnHash2.substr(0, 6)}
                                      ...
                                      {transaction.meta.txnHash2.substr(-6)}
                                    </Link>
                                  </Td>
                                  <Td>{transaction.meta.fxRate1}</Td>
                                  <Td>{transaction.meta.fxRate2}</Td>
                                </Tr>
                              ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
          </Center>
        </GridItem>
      </Grid>
    </>
  );
}
