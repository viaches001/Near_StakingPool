import React, { FunctionComponent } from 'react';
import { Stack, HStack, VStack, Text, Image, Button, Tr, Td } from '@chakra-ui/react'
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
        <Td display={{ sm: 'none', md: 'none', lg: 'table-cell' }}>
					<HStack 
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
							mt={'5px'}
            />
            <VStack 
							align={'left'}
					
            >
							<Text
								fontSize={'18px'}
								fontWeight={'800'}
								color={'rgb(228, 228, 228)'}
								className={'currencyText'}
								textAlign={'left'}
							>
								{coin.currency}
							</Text>
							<Text
								fontSize={'13px'}
								fontWeight={'400'}
								className={'chainText'}
								textAlign={'left'}
							>
								{coin.blockchain}
							</Text>
            </VStack>
          </HStack>
        </Td>
        <Td>{coinApr[coin.name]}%</Td>
        <Td>
					<Text fontWeight={'800'}>
						<AnimationNumber value={amount}/>&nbsp;{coin.currency}
					</Text>
					<Text fontWeight={'400'}>
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
							w={{ sm: '90%', md: '90%', lg: '46%' }}
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
							w={{ sm: '90%', md: '90%', lg: '46%' }}
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