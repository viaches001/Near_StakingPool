import React, { FunctionComponent, useEffect, useState } from 'react';
import { VStack } from '@chakra-ui/react'

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

const CommunityFarm: FunctionComponent = (props) => {
  const {state, dispatch} = useStore();
  const [farmInfo, setFarmInfo] = useState<any[]>();
  const selector = useNearSelector();

  useEffect( () => {
    const fetchData = async () => {
      if(!selector) return;
      
      const { nodeUrl } = selector.network;
      const provider = new providers.JsonRpcProvider({ url: nodeUrl });

      // try {
      //   let res: any[] = await api.contractQuery(
      //     POOL,
      //     {
      //       get_all_farm_info: { }
      //     });
        
      //   setFarmInfo(res);
      // } catch (e) {
      //   console.log(e)
      // }


      // amountHistory = await provider
      // .query<CodeResult>({
      //   request_type: "call_function",
      //   account_id: selector.getContractId(),
      //   method_name: "getMessages",
      //   args_base64: "",
      //   finality: "optimistic",
      // });

      // amountHistory = JSON.parse(Buffer.from(amountHistory.result).toString());
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