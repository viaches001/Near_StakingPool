import React, { FunctionComponent, useState, useEffect, useCallback, useMemo } from 'react';
import { VStack, Stack, Text, Divider, HStack, Image, Flex, Button } from '@chakra-ui/react'
import {  useInfiniteQuery } from "react-query"
import axios from "axios"

import { useWallet, useNearAPIURL } from '../../../store';
import HistoryItem from './HistoryItem';

export interface AccountHistory {
  limit: number
  next: number
  list: AccountHistoryItem[]
}

export interface AccountHistoryItem {
  txhash: string
  timestamp: any
  success: boolean
  msgs?: TxMessage[]
  collapsed?: number
  fee: CoinData[]
  memo?: string
  raw_log?: string
}

export interface TxMessage {
  msgType: string
  canonicalMsg: string[]
}

export interface CoinData {
  amount: string
  denom: string
}

const TransactionHistory: FunctionComponent = (props) => {
  const wallet = useWallet();
  const baseURL = useNearAPIURL();
  
  const fetchAccountHistory = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await axios.get<AccountHistory>(
        `tx-history/station/${wallet?.walletAddress}`,
        { baseURL, params: { offset: pageParam || undefined } }
      )

      return data
    },
    [wallet?.walletAddress, baseURL]
  )
  const { data, error, fetchNextPage, ...state } = useInfiniteQuery(
    ['', "history", baseURL, wallet?.walletAddress],
    fetchAccountHistory,
    { getNextPageParam: ({ next }) => next, enabled: !!(wallet?.walletAddress && baseURL) }
  )
  const getList = () => {
    if (!data) return []
    const [{ list }] = data.pages
    return list
  }
  const list = getList();

  return (
    <VStack
      w={'100%'}
      spacing={'18px'}
    >
      <Text
        fontSize={'20px'}
        fontWeight={'860'}
        lineHeight={'24px'}
      >
        TRANSACTION HISTORY
      </Text>
      <VStack 
        w={'100%'}
        rounded={'25px'} 
        background={'#212121'} 
        align={'center'}
        spacing={'34px'}
        px={{sm:'10px', md:'20px', lg:'50px'}}
        py={{sm:'10px', md:'20px', lg:'76px'}}
      >
        <VStack w={'100%'}>
          {list.map((item, index) => (
            <HistoryItem item={item} key={index}/>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
}
export default TransactionHistory;
