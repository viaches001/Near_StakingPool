import React, { FunctionComponent, useEffect, useState } from 'react';
import { VStack } from '@chakra-ui/react'

import { floorNormalize } from '../../Util';
import { POOL } from '../../constants';
import { useStore, useNearSelector } from '../../store';
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
import { providers } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";

const PotReward: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const [potInfo, setPotInfo] = useState<any[]>();
  const selector = useNearSelector();

  useEffect( () => {
    if(!selector) return;

    const { nodeUrl } = selector.network;
    const provider = new providers.JsonRpcProvider({ url: nodeUrl });

    const fetchData = async () => {
      // try {
      //   let res: any[] = await api.contractQuery(
      //     POOL,
      //     {
      //       get_all_pot_info: { }
      //     });
        
      //   setPotInfo(res);
      // } catch (e) {
      //   console.log(e)
      // }
    }
    fetchData();
  }, [selector])

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
          <TableCaption>Monthly Reward</TableCaption>
          <Thead>
            <Tr>
              <Th>Wallet</Th>
              <Th>Qulified UST Amount</Th>
              <Th>Qulified LUNA Amount</Th>
              <Th>UST Amount</Th>
              <Th>LUNA Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {potInfo?.map((item, index) => (
              <Tr>
              <Td>{item.wallet}</Td>
              <Td>{floorNormalize(item.qualified_ust_amount)}</Td>
              <Td>{floorNormalize(item.qualified_luna_amount)}</Td>
              <Td>{floorNormalize(item.ust_amount)}</Td>
              <Td>{floorNormalize(item.luna_amount)}</Td>
            </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
export default PotReward;