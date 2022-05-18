import React, { FunctionComponent, createRef, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Stack,
  Button,
  Text,
  Image,
  Tooltip
} from '@chakra-ui/react'
import './CoinTable.css';
import {
  COINTYPE,
  OpenDepositModal,
  OpenWithdrawModal,
  useStore,
} from '../../../store';

interface Props{
  data: {
    time: number,
    apr: number
  }[],
  id: string
}
const CoinTable: FunctionComponent = () => {
  const data = [
    {
      img: 'img/usdc.png',
      name: 'USDC',
      currency: 'usd',
      blockchain: 'USD Coin',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/eth.png',
      name: 'ETH',
      currency: 'ETH',
      blockchain: 'Ethereum',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/dai.png',
      name: 'DAI',
      currency: 'usd',
      blockchain: 'Dai',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/wbtc.png',
      name: 'wBTC',
      currency: 'wBTC',
      blockchain: 'Wrapped Bitcoin',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/usdt.png',
      name: 'USDT',
      currency: 'usd',
      blockchain: 'USD Tether',
      apy: '14.87',
      balance: 0,
      available: true
    },
    {
      img: 'img/NEARt.png',
      name: 'NEARt',
      currency: 'NEARt',
      blockchain: 'NEARt Treasury(Coming Soon)',
      apy: '14.87',
      balance: 0,
      available: false
    },
  ]

  const { state, dispatch } = useStore();
  return (
    <Stack 
      direction={{sm:'column', md:'row', lg:'row'}}
      mt={'53px'} 
      w={'100%'}
      rounded={'25px'} 
      background={'#212121'} 
      align={'center'}
      spacing={'50px'}
      px={{sm:'10px', md:'20px', lg:'50px'}}
      py={{sm:'10px', md:'20px', lg:'60px'}}
    >
      <TableContainer style={{ width: "100%"}}>
        <Table variant='simple' size='lg'>
          <Thead>
            <Tr>
              <Th w={'25%'}>Name</Th>
              <Th w={'10%'}>
                <Tooltip
                  label="Current annualized deposit rate"
                  background={'#C4C4C4'} hasArrow
                  placement='top-start'
                  color={'black'}
                >
                  <Text
                    fontSize={'13px'}
                    fontWeight={'800'}
                    lineHeight={'15px'}
                  >
                    APY
                  </Text>
                </Tooltip>
              </Th>
              <Th w={'30%'}>
                <Tooltip
                  label="Total of all LUNA deposits including earnings "
                  background={'#C4C4C4'} hasArrow
                  placement='top-start'
                  color={'black'}
                >
                  <Text
                    fontSize={'13px'}
                    fontWeight={'800'}
                    lineHeight={'15px'}
                  >
                    TVL
                  </Text>
                </Tooltip>
              </Th>
              <Th w={'32%'}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(row => {
              let type = row.name.toLocaleLowerCase();
              return (<Tr>
                <Td>
                  <Stack 
                    direction={{sm:'row', md:'row', lg:'row'}}
                    w={'100%'}
                    align={'left'}
                    spacing={'5px'}
                  >
                    <Image
                      borderRadius='full'
                      boxSize='36px'
                      src={row.img}
                      alt='Dan Abramov'
                      mt={'10px'}
                    />
                    <Stack 
                      direction={{sm:'column', md:'column', lg:'column'}}
                      align={'center'}
                      justifyContent={'center'}
                    >
                      <Text
                        fontSize={'18px'}
                        fontWeight={'800'}
                        color={'rgb(228, 228, 228)'}
                        mx={0}
                      >
                        {row.name}
                      </Text>
                      <Text
                        fontSize={'13px'}
                        fontWeight={'400'}
                        mt={'0px'}
                      >
                        {row.name}
                      </Text>
                    </Stack>
                  </Stack>
                </Td>
                <Td>{row.apy}</Td>
                <Td>
                  <Text
                    fontWeight={'800'}
                  >
                    {row.balance}&nbsp;{row.currency}
                  </Text>
                  <Text
                    fontWeight={'400'}
                  >
                    {row.balance}&nbsp;USD Value
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
                      onClick={() => OpenDepositModal(state, dispatch, type as COINTYPE)}
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
                      onClick={() => OpenWithdrawModal(state, dispatch, type as COINTYPE)}
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
              </Tr>)
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}


export default CoinTable;