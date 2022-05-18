import React, { FunctionComponent, useEffect, useState } from 'react';
import { VStack, HStack, Stack, Flex, Text, Image, Link, Center, Divider, Button } from '@chakra-ui/react'
import { MdInfoOutline } from 'react-icons/md';
import Warning from '../../../../assets/Warning.svg'
import { ActionKind, OpenDepositModal, useStore } from '../../../../store';

const Qualifying: FunctionComponent = (props) => {
  const { state, dispatch } = useStore();
  const [active, setActive] = useState(false);

  function calcTime(offset: number) {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let nd = new Date(utc + (3600000 * offset));

    let minute = nd.getMinutes();
    if (minute >= 1 && minute <= 10) {
      setActive(true);
      dispatch({ type: ActionKind.setQualified, payload: true });
    }
    else {
      setActive(false);
      dispatch({ type: ActionKind.setQualified, payload: false });
    }
console.log(minute)
    // let day = nd.getDate();
    // if (day >= 1 && day <= 7) {
    //   setActive(true);
    //   dispatch({ type: ActionKind.setQualified, payload: true });
    // }
    // else {
    //   setActive(false);
    //   dispatch({ type: ActionKind.setQualified, payload: false });
    // }

  }
  useEffect(() => {
    calcTime(-4)
  }, [])

  return (
    <Flex w={'100%'} direction="column" align={'baseline'}>
      <HStack>
        <Text
          fontSize={'20px'}
          fontWeight={'860'}
          lineHeight={'24px'}
        >
          QUALIFYING PHASE STATUS
        </Text>
        <a href="link: https://app.gitbook.com/s/kngrjQ3XHOHWXNeVNLmt/tt-protocol/rewards" target={"_blank"} rel="noreferrer">
          <MdInfoOutline />
        </a>
      </HStack>
      <Flex
        w={'93px'}
        mt={'19px'}
        h={'39px'}
        background={active ? '#57A146' : 'red'}
        rounded={'15px'}
        justify={'center'}
        align={'center'}
      >
        <Text
          fontSize={'13px'}
          fontWeight={'860'}
          lineHeight={'15px'}
        >
          {active ? "ACTIVE" : "OFF"}
        </Text>
      </Flex>
      <HStack
        w={'100%'}
        align={'center'}
        mt={'29px'}
        pl={'29px'}
        pr={'39px'}
        rounded={'15px'}
        border={'solid white 1px'}
        background={'#493C3C'}
        color={'white'}
        spacing={'20px'}
      >
        <Flex w={'15px'}>
          <MdInfoOutline size='15px' />
        </Flex>
        <VStack spacing={'10px'} py={'10px'} align={'baseline'}>
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}
          >
            IF THE BUTTON IS GREEN, THIS MEANS EVERY DEPOSIT DURING THIS PERIOD QUALIFIES YOU FOR THE MONTHLY REWARDS+ PROGRAM.
          </Text>
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}
          >
            IF THE BUTTON IS RED, THIS MEANS YOU NEED TO KEEP YOUR BALANCE DEPOSITED TO BECOME ELIGIBLE FOR THE NEXT QUALIFIYNG PHASE.
          </Text>
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}
          >
            ALL PAYOUTS OF THE REWARDS+ PROGRAM ARE AUTOMATED.
          </Text>
        </VStack>
      </HStack>
    </Flex>
  );
}
export default Qualifying;