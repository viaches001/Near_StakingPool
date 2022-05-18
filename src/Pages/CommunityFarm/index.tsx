import React, { FunctionComponent, useEffect, useState } from 'react';
import { Stack, VStack, Flex, Button } from '@chakra-ui/react'
import { MsgExecuteContract, WasmAPI, Coin, LCDClient, Fee } from '@terra-money/terra.js'
import { ConnectedWallet } from '@terra-money/wallet-provider'

import { POOL } from '../../constants';
import { useStore, useLCD } from '../../store';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

const CommunityFarm: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const [farmInfo, setFarmInfo] = useState<any[]>();
  const lcd = useLCD();
  const api = new WasmAPI(lcd.apiRequester);

  useEffect( () => {
    const fetchData = async () => {
      try {
        let res: any[] = await api.contractQuery(
          POOL,
          {
            get_all_farm_info: { }
          });
        
        setFarmInfo(res);
      } catch (e) {
        console.log(e)
      }
    }
    fetchData();
  }, [lcd])

  return (
    <VStack 
      mt={'15px'} 
      px={{sm:'10px', md:'20px', lg:'110px'}}
      w={'100%'}
      spacing={'53px'}
      textColor={'black'}
    >
      <TableContainer>
        <Table variant='simple' colorScheme='yellow' textColor={'white'}>
          <TableCaption>Community Farm</TableCaption>
          <Thead>
            <Tr>
              <Th>Wallet</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {farmInfo?.map((item, index) => (
              <Tr>
              <Td>{item.wallet}</Td>
              <Td>{item.amount}</Td>
            </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
export default CommunityFarm;