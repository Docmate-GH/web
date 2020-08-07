import * as React from 'react'
import { View, Flex, Text } from "@adobe/react-spectrum"


export default () => {
  return (
    <View backgroundColor='static-white' paddingY='size-200'>
      <Flex justifyContent='center'>
        <View width='960px'>
          <Flex gap='size-200'>
            <View>
              <strong>Docmate</strong>
            </View>

            <View>
              <Text>© All rights reserved.</Text>
            </View>
          </Flex>
        </View>

      </Flex>
    </View>
  )
}