import React, { FunctionComponent } from 'react';
import { VStack, Stack, Text, Divider, HStack, Image, Flex, Button } from '@chakra-ui/react'
import { Grid, GridItem, Tooltip } from '@chakra-ui/react'

// import LunaIcon from './../../../assets/Luna.svg'
import {
  OpenDepositModal,
  OpenWithdrawModal,
  useStore,
  useLUNAApr,
  useLUNADeposited,
  useExchangeRate,
} from '../../../store';
import AnimationNumber from '../../Components/AnimationNumber';
import { floor, floorNormalize } from '../../../Util';

interface Props {
  data: any
}

const DepositPanel: FunctionComponent<Props> = (props) => {
  const { state, dispatch } = useStore();
  const apr = useLUNAApr();
  const rate = useExchangeRate();

  const lunaDeposited = useLUNADeposited() + floorNormalize(state.userInfoLuna.reward_amount);
  const amount = lunaDeposited * rate;
  const data = props.data;

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
              src={data.img}
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
                {data.name}
              </Text>
              <Text
                fontSize={'13px'}
                fontWeight={'400'}
                lineHeight={'15.6px'}
              >
                 {data.name}
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
            {data.currency == 'usd' && <Text
              fontSize={'13px'}
              fontWeight={'400'}
              lineHeight={'15.6px'}
            >
              ${data.balance == 0? '000,000.00': <AnimationNumber value={data.balance}/>}
            </Text>}
            {data.currency != 'usd' && <Text
              fontSize={'13px'}
              fontWeight={'400'}
              lineHeight={'15.6px'}
            >
              ${data.balance == 0? '000,000.00': <AnimationNumber value={data.balance}/>}&nbsp;{data.currency}
              <br></br>
              ${data.balance == 0? '000,000.00': <AnimationNumber value={data.balance}/>}&nbsp;USD&nbsp;value
            </Text>}
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
              <AnimationNumber value={data.apy} />%
            </Text>
          </Flex>
        </GridItem>
      </Grid>
      {data.available && <Stack
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
          onClick={() => OpenDepositModal(state, dispatch, data.name.toLocaleLowerCase())}
        >
          <Text
            fontSize={'14px'}
            fontWeight={'800'}
            lineHeight={'10.8px'}
            color={'white'}
          >
            Deposit
          </Text>
        </Button>
        <Button
          w={'200px'}
          h={'50px'}
          background={'#212121'}
          rounded={'25px'}
          border={'solid 1px #CEBFBF'}
          onClick={() => OpenWithdrawModal(state, dispatch, data.name.toLocaleLowerCase())}
        >
          <Text
            fontSize={'14px'}
            fontWeight={'800'}
            lineHeight={'10px'}
            color={'#CEBFBF'}
          >
            Withdraw
          </Text>
        </Button>
      </Stack>}
      {!data.available && <Stack
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
          onClick={() => OpenDepositModal(state, dispatch, data.name.toLocaleLowerCase())}
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