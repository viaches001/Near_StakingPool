import React, { FunctionComponent, useState, useEffect, useCallback, useMemo } from 'react';
import { VStack, Stack, Text, Divider, HStack, Image, Flex, Button } from '@chakra-ui/react'
import {  useInfiniteQuery } from "react-query"
import axios from "axios"

import { useNearAPIURL } from '../../../store';
import HistoryItem from './HistoryItem';
import { useWalletSelector } from '../../../context/NearWalletSelectorContext';

import { providers } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { POOL } from '../../../constants';

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
  const baseURL = useNearAPIURL();
  const { accountId, selector } = useWalletSelector();

  const { nodeUrl } = selector.network;
  const provider = new providers.JsonRpcProvider({ url: nodeUrl });
  
  // const fetchAccountHistory = useCallback(
  //   async ({ pageParam = 0 }) => {
  //     const { data } = await axios.get<AccountHistory>(
  //       `tx-history/station/${accountId}`,
  //       { baseURL, params: { offset: pageParam || undefined } }
  //     )

  //     return data
  //   },
  //   [accountId, baseURL]
  // )
  // const { data, error, fetchNextPage, ...state } = useInfiniteQuery(
  //   ['', "history", baseURL, accountId],
  //   fetchAccountHistory,
  //   { getNextPageParam: ({ next }) => next, enabled: !!(accountId && baseURL) }
  // )
  // const getList = () => {
  //   if (!data) return []
  //   const [{ list }] = data.pages
  //   return list
  // }
  // const list = getList();

  const [list, setList] = useState([]);

  useEffect(() => {
   const getHistory = async () => {
    const res = await provider
    .query<CodeResult>({
      request_type: "call_function",
      account_id: POOL,
      method_name: `get_user_oper_history`,
      args_base64: btoa(JSON.stringify({wallet: accountId})),
      finality: "optimistic",
    });
    let data = JSON.parse(Buffer.from(res.result).toString());
    data = data.map((item: any) => ({
      msgs: [{
        msgType: 'deposited',
        canonicalMsg: [],
      }],
      txhash: item.txhash,
      timestamp: item.timestampe/(10 ** 6)
    }))

    setList(data);
   };

   getHistory();
  }, [accountId])

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
          {/* {list.length && list.map((item: any, index: any) => (
            <HistoryItem item={item} key={index}/>
          ))}
          {list.length == 0 && (
            <>
              <Text
                fontSize={'20px'}
                fontWeight={'860'}
                lineHeight={'24px'}
              >
                No Transaction history
              </Text>
              <Text
                fontSize={'14px'}
                fontWeight={'860'}
                lineHeight={'24px'}
                color={'#CEBFBF'}
              >
                Looks like you haven’t made any transactions yet.
              </Text>
            </> */}
          {list.length && list.map((item: any, index: any) => (
            <HistoryItem item={item} key={index}/>
          ))}
          {list.length == 0 && (
            <>
              <Text
                fontSize={'20px'}
                fontWeight={'860'}
                lineHeight={'24px'}
              >
                No Transaction history
              </Text>
              <Text
                fontSize={'14px'}
                fontWeight={'860'}
                lineHeight={'24px'}
                color={'#CEBFBF'}
              >
                Looks like you haven’t made any transactions yet.
              </Text>
            </>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
export default TransactionHistory;
