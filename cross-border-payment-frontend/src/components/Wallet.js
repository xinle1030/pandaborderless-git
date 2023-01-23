import React, { useState, useEffect } from 'react';
import { Text, Button, ButtonGroup, IconButton } from '@chakra-ui/react';

// Import Wagmi hooks
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { CloseIcon } from '@chakra-ui/icons';

export default function Wallet() {
  const { address, isConnected, connector } = useAccount();
  const [isSSR, setIsSSR] = useState(true);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  useEffect(() => {
    setIsSSR(false);
  }, []);
  const { disconnect } = useDisconnect();

  return (
    <>
      {!isSSR && isConnected ? (
        <ButtonGroup isAttached>
          <Button colorScheme={'secondary'}>
            <Text borderRadius={'2xl'} px={'3'}>
              {address?.toString().slice(0, -36)}...
              {address?.toString().substring(38)}
            </Text>
          </Button>
          <IconButton
            colorScheme="secondary"
            color="red.500"
            aria-label="Disconnect"
            icon={<CloseIcon />}
            onClick={disconnect}
          />
        </ButtonGroup>
      ) : (
        <Button
          display={{ base: 'none', md: 'inline-flex' }}
          fontSize={'sm'}
          fontWeight={600}
          color={'white'}
          bg={'primary.800'}
          _hover={{
            bg: 'primary.300',
          }}
          onClick={() => {
            connect();
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}
