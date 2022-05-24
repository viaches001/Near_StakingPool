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
import { useConnectedCoin, useConnectWallet } from '../../../../store';

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
    + floorNormalize(state.coin_total_rewards[coin.name]) || 0;
  const usd_amount = amount * rate || 0;
  const connectedCoin = useConnectedCoin();
  const connectWallet = useConnectWallet();

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
					{amount == 0? '000,000.00' : (<AnimationNumber value={amount}/>)}&nbsp;{coin.currency}
				</Text>
				<Text fontWeight={'400'}>
					${usd_amount == 0? '000,000.00' : <AnimationNumber value={usd_amount}/>}&nbsp;USD Value
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
						onClick={!connectedCoin[coin.name]? connectWallet: () => OpenDepositModal(state, dispatch, coin.name)}
					>
						<Text
							fontSize={'11px'}
							fontWeight={'800'}
							lineHeight={'15px'}
						>
							{connectedCoin[coin.name]? 'Deposit': 'Connect Wallet'}
						</Text>
					</Button>
					<Button 
						h={'45px'} 
						w={{ sm: '90%', md: '90%', lg: '46%' }}
						// background={'#493C3C'} 
						rounded={'25px'}
						variant='outline'
						onClick={!connectedCoin[coin.name]? connectWallet: () => OpenWithdrawModal(state, dispatch, coin.name)}
					>
						<Text
							fontSize={'11px'}
							fontWeight={'800'}
						>
							{connectedCoin[coin.name]? 'Withdraw': 'Connect Wallet'}
						</Text>
					</Button>
				</Stack>
			</Td>
    </Tr>
  );
}
export default CoinRow;