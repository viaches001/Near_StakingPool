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
  useCoinApr,
  useExchangeRate
} from '../../../store';
import {
  coins
} from '../../../constants';
import { floor, floorNormalize } from '../../../Util';
import AnimationNumber from '../../Components/AnimationNumber';
import CoinRow from './CoinRow'

const CoinTable: FunctionComponent = () => {
  const { state, dispatch } = useStore();
  const rates = useExchangeRate();
  const coinApr = useCoinApr();
  const history = state.amountHistory;
  const last = history.length - 1;

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
              <Th w={'20%'} display={{ sm: 'none', md: 'none', lg: 'table-cell' }}>Name</Th>
              <Th w={'10%'}>
                <Tooltip
                  label="Current annualized deposit rate"
                  background={'#C4C4C4'}
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
                  label="Total of all Coin deposits including earnings "
                  background={'#C4C4C4'} 
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
              <Th w={'40%'}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coins.filter(coin => coin.available).map(coin => (
              <CoinRow 
                rates={rates} 
                coin={coin}
                history={history} 
                coinApr={coinApr}
                last={last}
                key={coin.name}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}


export default CoinTable;