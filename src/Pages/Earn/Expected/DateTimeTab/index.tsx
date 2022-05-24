import React, { FunctionComponent, useState } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from "react";

import Tab from './Tab';
import {
  useCoinDeposited,
  useExchangeRate,
  useCoinApr,
} from '../../../../store';
import { coins } from '../../../../constants';

interface Props {
  setInterest: Dispatch<SetStateAction<number>>,
}

const DateTimeTab: FunctionComponent<Props> = ({setInterest}) => {
  const [tab, setTab] = useState('year');

  let rate = 1;
  switch (tab) {
    case 'year': rate = 1; break;
    case 'month': rate = 1 / 12; break;
    case 'week': rate = 1 / 54; break;
    case 'day': rate = 1 / 365; break;
  }

  const coinDeposited = useCoinDeposited();
  const exchangeRates = useExchangeRate();
  const coinAprs = useCoinApr();

  let value = 0;
  coins.forEach(coin => {
    value += coinDeposited[coin.name] * exchangeRates[coin.name] * coinAprs[coin.name] / 100 * rate;
  })

  setInterest(Math.floor(value));

  return (
    <Flex
      w={'100%'}
      h={'49px'}
      mt={'56px'}
      rounded={'25px'}
      background={'#212121'}
      align={'center'}
    >
      <Tab id='year' current={tab} setCurrent={setTab}>YEAR</Tab>
      <Tab id='month' current={tab} setCurrent={setTab}>MONTH</Tab>
      <Tab id='week' current={tab} setCurrent={setTab}>WEEK</Tab>
      <Tab id='day' current={tab} setCurrent={setTab}>DAY</Tab>
    </Flex>
  );
}
export default DateTimeTab;