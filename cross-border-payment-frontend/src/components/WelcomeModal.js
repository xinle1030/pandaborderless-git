import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const WelcomeModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showCount, setShowCount] = useState(0);

  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem('modalShowCount') || '0');
    setShowCount(storedCount);

    if (storedCount < 3) {
      onOpen();
    }
  }, [onOpen]);

  const handleClose = () => {
    if (showCount < 3) {
      localStorage.setItem('modalShowCount', (showCount + 1).toString());
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      motionPreset="slideInBottom"
      size={'xl'}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thank You for Your Interest!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3}>
            PandaBorderless was developed by{' '}
            <Link
              href="https://www.linkedin.com/in/yungxin-shin/"
              textDecoration={'underline'}
              textColor={'teal.500'}
            >
              Shin Yung Xin
            </Link>
            ,{' '}
            <Link
              href="https://www.linkedin.com/in/xin-le-lam/"
              textDecoration={'underline'}
              textColor={'teal.500'}
            >
              Lam Xin Le
            </Link>{' '}
            and{' '}
            <Link
              href=" https://www.linkedin.com/in/fabianchua6/"
              textDecoration={'underline'}
              textColor={'teal.500'}
            >
              Fabian Chua
            </Link>{' '}
            as a prototype for the NUS FinTech Month Hackathon 2023. We are
            honoured to have been chosen as the top 10 finalists and to have
            received Bybit's Most Reliable FinTech Solution Award 🏆. We greatly
            appreciate your interest in our innovation! If you'd like to learn
            more, please feel free to explore our DevPost submission and GitHub
            repository
          </Text>
          <VStack spacing={2} alignItems="start">
            <Link
              href="https://devpost.com/software/pandaborderless-koc65g"
              isExternal
            >
              DevPost Submission <ExternalLinkIcon mx="2px" />
            </Link>
            <Link
              href="https://github.com/xinle1030/pandaborderless-git"
              isExternal
            >
              GitHub Repository <ExternalLinkIcon mx="2px" />
            </Link>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;
