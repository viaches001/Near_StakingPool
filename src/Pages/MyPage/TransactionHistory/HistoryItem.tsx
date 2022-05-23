import React, { FunctionComponent } from 'react';
import { VStack, Stack, Text, Divider, HStack, Image, Flex, Button } from '@chakra-ui/react'

import { MdNorthEast } from 'react-icons/md'
import { AccountHistoryItem } from './index'
import { useNetworkName } from '../../../store'

interface Props {
  item: AccountHistoryItem
}
const HistoryItem: FunctionComponent<Props> = ({ item }) => {
  let net = useNetworkName();
  let findURL = net == 'mainnet'? "https://explorer.near.org/transactions/" : "https://explorer.testnet.near.org/transactions/";
  return (
    <>
      <Flex
        w={'100%'}
        justify={'space-between'}
        align={'center'}
      >
        <VStack align={'baseline'}>
          {item?.msgs?.map((msg, index) => (
            <Flex w={'100%'} direction={'column'} key={index} >
              <Text
                fontSize={'13px'}
                fontWeight={'860'}
                lineHeight={'15px'}
              >
                {msg.msgType}
              </Text>
              <HStack spacing={'10px'} >
                <VStack align={'baseline'}>
                  {msg.canonicalMsg.map((cmsg, index) => (
                    <Text
                      fontSize={'13px'}
                      fontWeight={'860'}
                      lineHeight={'15px'}
                      key={index}
                    >
                      {cmsg.slice(0, 100)}
                    </Text>
                  ))}
                </VStack>
                <a href={`${findURL}${item.txhash}`} target="_blank" rel="noreferrer">
                  <MdNorthEast />
                </a>
              </HStack>
            </Flex>
          ))}
        </VStack>
        <Text
          fontSize={'10px'}
          fontWeight={'860'}
          lineHeight={'12px'}
        >
          {
            new Date(item.timestamp).toLocaleString()
          }
        </Text>
      </Flex>
      <Divider orientation='horizontal' />
    </>
  );
}
export default HistoryItem;
