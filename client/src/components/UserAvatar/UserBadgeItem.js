import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default function UserBadgeItem({user,handleFunction}) {
  return (
    <Box px={2} py={1} borderRadius='lg' m={1} mb={1} variant='solid' fontSize={12} backgroundColor='#3182ce' color='white' >{user.name}<CloseIcon cursor='pointer' onClick={handleFunction} pl={1}/>
    </Box>
  )
}
