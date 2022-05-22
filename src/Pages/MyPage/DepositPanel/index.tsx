import React, { FunctionComponent } from 'react';
import { VStack, Stack, Text, Divider, HStack, Image, Flex, Button } from '@chakra-ui/react'
import { Grid, GridItem, Tooltip } from '@chakra-ui/react'

// import LunaIcon from './../../../assets/Luna.svg'
import {
  OpenDepositModal,
  OpenWithdrawModal,
  useStore,
  useCoinApr,
  useCoinDeposited,
  useExchangeRate,
} from '../../../store';
import AnimationNumber from '../../Components/AnimationNumber';
import { floor, floorNormalize } from '../../../Util';
import { useConnectedCoin, useNearSelector, ActionKind } from '../../../store';
import { successOption, errorOption } from '../../../constants';
import { toast } from 'react-toastify';
import { ethers } from "ethers";

interface Props {
  coin: any
}

declare let window: any;

const DepositPanel: FunctionComponent<Props> = (props) => {
  const { state, dispatch } = useStore();
  const aprs = useCoinApr();
  const rates = useExchangeRate();
  const coin = props.coin;
  const rate = rates[coin.name];
  
  const coinDeposited = useCoinDeposited() + floorNormalize(state.userInfoCoin[coin.name].reward_amount);
  const apr = aprs[coin.name];
  const amount = coinDeposited * rate;
  const connectedCoin = useConnectedCoin();
  const nearSelector = useNearSelector();

  const logoutMetamask = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });

  }

  const connectWallet = async (coinSystem: string) => {
    if(coinSystem == 'Near') {
      nearSelector?.show();
    }
    else if(coinSystem == 'Ethereum') {
      if (!window.ethereum) {
        toast("No crypto wallet found. Please install it.", errorOption);
      }

      await logoutMetamask();
    
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      dispatch({ type: ActionKind.setConnectedEthereum, payload: true });
      dispatch({ type: ActionKind.setEthereumSigner, payload: signer });
    }
    else if(coinSystem == 'Aurora') {
      
    }
  }

  return (
    <VStack
      w={'100%'}
      rounded={'25px'}
      background={'#212121'}
      align={'center'}
      spacing={'34px'}
      color={'#CEC0C0'}
      px={{ sm: '10px', md: '20px', lg: '50px' }}
      py={{ sm: '10px', md: '20px', lg: '29px' }}
    >
      <Grid
        templateColumns="50% 25% 25%"
        gap={0}
        w={'100%'}
      >
        <GridItem w={'100%'} h={'100px'}>
          <HStack
            w={'100%'}
            h={'100%'}
            spacing={'27px'}
            align={'center'}
            justify={'left'}
            display={{ sm: 'none', md: 'none', lg: 'flex' }}
          >
            <Image 
              borderRadius='full'
              boxSize='36px'
              src={coin.img}
              alt='Dan Abramov'
              mt={'10px'}
            />
            <VStack align={'baseline'} spacing={'0px'}>
              <Text
                fontSize={'20px'}
                fontWeight={'800'}
                lineHeight={'36px'}
                color={'white'}
              >
                {coin.currency}
              </Text>
              <Text
                fontSize={'13px'}
                fontWeight={'400'}
                lineHeight={'15.6px'}
              >
                 {coin.blockchain}
              </Text>
            </VStack>
          </HStack>
        </GridItem>
        <GridItem w={'100%'} h={'100px'}>
          <VStack w={'100%'} h={'100%'} align={'center'} justify={'center'} >
            <Text
              fontSize={'13px'}
              fontWeight={'400'}
              lineHeight={'15.6px'}
            >
              Saving Balance
            </Text>
            <Text
              fontSize={'13px'}
              fontWeight={'400'}
              lineHeight={'15.6px'}
            >
              {coinDeposited == 0? '000,000.00': <AnimationNumber value={coinDeposited}/>}&nbsp;{coin.currency}
              <br></br>
              ${amount == 0? '000,000.00': <AnimationNumber value={amount}/>}&nbsp;USD&nbsp;value
            </Text>
          </VStack>
        </GridItem>
        <GridItem w={'100%'} h={'100px'}>
          <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'}>
            <Text
              fontSize={'20px'}
              fontWeight={'800'}
              lineHeight={'36px'}
            >
              APY
            </Text>
            <Text
              fontSize={'13px'}
              fontWeight={'400'}
              lineHeight={'15.6px'}
            >
              <AnimationNumber value={apr} />%
            </Text>
          </Flex>
        </GridItem>
      </Grid>
      {coin.available && <Stack
        direction={{ sm: 'column', md: 'column', lg: 'row' }}
        w={'100%'}
        h={'100%'}
        align={'center'}
        justify={'center'}
        spacing={'15px'}
      >
        <Button
          w={'200px'}
          h={'50px'}
          background={'#493C3C'}
          rounded={'25px'}
          onClick={!connectedCoin[coin.name]? () => connectWallet(coin.system): () => OpenDepositModal(state, dispatch, coin.name)}
        >
          <Text
            fontSize={'14px'}
            fontWeight={'800'}
            lineHeight={'10.8px'}
            color={'white'}
          >
            {connectedCoin[coin.name]? 'Deposit': 'Connect Wallet'}
          </Text>
        </Button>
        <Button
          w={'200px'}
          h={'50px'}
          background={'#212121'}
          rounded={'25px'}
          border={'solid 1px #CEBFBF'}
          onClick={!connectedCoin[coin.name]? () => connectWallet(coin.system): () => OpenWithdrawModal(state, dispatch, coin.name)}
        >
          <Text
            fontSize={'14px'}
            fontWeight={'800'}
            lineHeight={'10px'}
            color={'#CEBFBF'}
          >
             {connectedCoin[coin.name]? 'Withdraw': 'Connect Wallet'}
          </Text>
        </Button>
      </Stack>}
      {!coin.available && <Stack
        direction={{ sm: 'column', md: 'column', lg: 'row' }}
        w={'100%'}
        h={'100%'}
        align={'center'}
        justify={'center'}
        spacing={'15px'}
      >
        <Button
          w={'400px'}
          h={'50px'}
          background={'#212121'}
          rounded={'25px'}
          border={'solid 1px #CEBFBF'}
          onClick={() => OpenDepositModal(state, dispatch, coin.name)}
        >
          <Text
            fontSize={'14px'}
            fontWeight={'800'}
            lineHeight={'10px'}
            color={'#CEBFBF'}
          >
            Comming Soon
          </Text>
        </Button>
      </Stack>}
    </VStack>
  );
}
export default DepositPanel;