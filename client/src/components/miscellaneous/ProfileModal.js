import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button, Image, Text } from '@chakra-ui/react'
import React from 'react'

export default function ProfileModal({user,children}){

  const {isOpen,onOpen,onClose} = useDisclosure();

  return (
    <>
    {children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>) }
    <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height='410px'>
          <ModalHeader fontSize='40px' fontFamily='Work Sans' display='flex' justifyContent='center'>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
            <Image borderRadius='full' boxSize='150px' src={user.pic} alt={user.name}/>
            <Text fontSize={{base:'28px',md:'30px'}} fontFamily='Work Sans'>{user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
