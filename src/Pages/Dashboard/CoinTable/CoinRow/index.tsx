import React, { FunctionComponent } from 'react';
import { Stack, Text, Image, Button, Tr, Td } from '@chakra-ui/react'
import {
  OpenDepositModal,
  OpenWithdrawModal,
  useStore,
  COINTYPE
} from '../../../../store';
import AnimationNumber from '../../../Components/AnimationNumber';
import { floor, floorNormalize } from '../../../../Util';

interface Props {
    rates: any,
    coin: any,
    history: any,
    last: number,
    coinApr: any
}

const CoinRow: FunctionComponent<Props> = ({rates, coinApr, coin, history, last}) => {
  const { state, dispatch } = useStore();
  const rate = rates[coin.name];
  const amount = (last >= 0 ? floor(history[last][`${coin.name}_amount`]) : 0)+
    + floorNormalize(state.coin_total_rewards[coin.name]);
  const usd_amount = amount * rate;

  return (
    <Tr>
        <Td>
            <Stack 
            direction={{sm:'row', md:'row', lg:'row'}}
            w={'100%'}
            align={'left'}
            spacing={'2px'}
            >
            <Image
                borderRadius='full'
                boxSize='36px'
                src={coin.img}
                alt='Dan Abramov'
                mt={'10px'}
            />
            <Stack 
                direction={{sm:'column', md:'column', lg:'column'}}
                align={'center'}
                justifyContent={'center'}
                display={{ sm: 'none', md: 'none', lg: 'flex' }}
            >
                <Text
                fontSize={'18px'}
                fontWeight={'800'}
                color={'rgb(228, 228, 228)'}
                className={'currencyText'}
                >
                {coin.currency}
                </Text>
                <Text
                fontSize={'13px'}
                fontWeight={'400'}
                className={'chainText'}
                >
                {coin.blockchain}
                </Text>
            </Stack>
            </Stack>
        </Td>
        <Td>{coinApr[coin.name]}%</Td>
        <Td>
            <Text
            fontWeight={'800'}
            >
            <AnimationNumber value={amount}/>&nbsp;{coin.currency}
            </Text>
            <Text
            fontWeight={'400'}
            >
            $<AnimationNumber value={usd_amount}/>&nbsp;USD Value
            </Text>
        </Td>
        <Td>
            <Stack 
            direction={{sm:'column', md:'row', lg:'row'}}
            w={'100%'}
            align={'center'}
            spacing={'10px'}
            justifyContent={'space-between'}
            >
            <Button 
                h={'45px'} 
                w={'46%'}
                background={'#493C3C'} 
                rounded={'25px'}
                onClick={() => OpenDepositModal(state, dispatch, coin.name as COINTYPE)}
            >
                <Text
                    fontSize={'11px'}
                    fontWeight={'800'}
                    lineHeight={'15px'}
                >
                    Deposit
                </Text>
            </Button>
            <Button 
                h={'45px'} 
                w={'46%'}
                // background={'#493C3C'} 
                rounded={'25px'}
                variant='outline'
                onClick={() => OpenWithdrawModal(state, dispatch, coin.name as COINTYPE)}
            >
                <Text
                    fontSize={'11px'}
                    fontWeight={'800'}
                >
                    Withdraw
                </Text>
            </Button>
            </Stack>
        </Td>
    </Tr>
  );
}
export default CoinRow;