import React, { FunctionComponent } from 'react';
import { VStack, HStack, Stack, Flex, Text, Input, Icon, Center, Divider, Button, useBoolean } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from "react";
import { floorNormalize } from '../../../Util';
import { useCoinDeposited, COINTYPE, useStore, ActionKind } from '../../../store'
import { MdSettingsBackupRestore } from "react-icons/md";
import { providers } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { coins } from '../../../constants';

interface Props {
  amount: string,
  coin: any,
  setAmount: Dispatch<SetStateAction<string>>,
}
const InputPanel: FunctionComponent<Props> = (props) => {
  const { state, dispatch } = useStore();
  const coinDeposited = useCoinDeposited()[state.coinType] + floorNormalize(state.userInfoCoin[state.coinType].reward_amount);

  const maxBalance = () => {
    props.setAmount(coinDeposited.toString());
  }

  async function getBalances() {
    const nodeUrl = state.nearSelector?.network?.nodeUrl || '';
    const provider = new providers.JsonRpcProvider({ url: nodeUrl });

    try {
      for(const coin of coins.filter((item: any) => item.available)) {
        const res = await provider
        .query<CodeResult>({
          request_type: "call_function",
          account_id: coin.testnet_address,
          method_name: "ft_balance_of",
          args_base64: btoa(JSON.stringify({account_id: localStorage.getItem('accountId')})),
          finality: "optimistic",
        })
        
        const amount = JSON.parse(Buffer.from(res.result).toString());
        dispatch({type: ActionKind.setUCoinBalance, payload: { type: coin.name, data: coin.floorNormalize(amount)}});
      }
    }
    catch(e) {console.log(e)}
  }

  return (
    <VStack w={'100%'} spacing={'6px'}>
      <Flex
        background={'#493C3C'}
        rounded={'10px'}
        w={'100%'}
        h={'45px'}
        px={'20px'}
        mt={'27px'}
        align={'center'}
        justify={'space-between'}
      >
        <Text
          fontSize={'13px'}
          fontWeight={'860'}
          lineHeight={'15px'}
          color={'#CEC0C0'}
        >
          AMOUNT
        </Text>
        <Input
          width={'100%'}
          textAlign={'right'}
          color={'white'}
          border={'none'}
          value={props.amount}
          onChange={(e) => props.setAmount(e.target.value)}
          _focus={{ border: 'none' }}
        />
        <Text
          fontSize={'13px'}
          fontWeight={'860'}
          lineHeight={'15px'}
          color={'white'}
        >
          {state.coinType.toUpperCase()}
        </Text>
      </Flex>
      <Flex
        justify={'flex-end'}
        w={'100%'}
      >
        <Text
          fontSize={'9px'}
          fontWeight={'400'}
          lineHeight={'11px'}
          color={'#CEC0C0'}
          cursor={'pointer'}
          onClick={() => maxBalance()}
        >
          MAX: {coinDeposited} {props.coin.currency}
        </Text>
      </Flex>
      <Flex
        justify={'flex-end'}
        w={'100%'}
      >
        <Button 
          w={'120px'} 
          h={'22px'} 
          mt={'3px'} 
          background={'#493C3C'} 
          rounded={'5px'}
          onClick={() => getBalances()}
        >
          <Icon as={MdSettingsBackupRestore} color={'#CEC0C0'} />
          <Text
            fontSize={'12px'}
            fontWeight={'360'}
            lineHeight={'15px'}      
            color={'#CEC0C0'}
          >
            Update Balance
          </Text>
        </Button>
      </Flex>
    </VStack>
  );
}
export default InputPanel;