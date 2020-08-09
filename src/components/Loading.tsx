import * as React from 'react'
import { View, Flex, ProgressCircle } from '@adobe/react-spectrum'

export default () => {
  return <View backgroundColor='static-white' padding='size-500' UNSAFE_className='rounded'>
    <Flex justifyContent='center'>
      <ProgressCircle isIndeterminate />
    </Flex>
  </View>
}