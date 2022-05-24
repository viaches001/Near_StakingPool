import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  VStack,
  HStack,
  Stack,
  Box,
  Flex,
  Text, Input,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  SliderMark
} from '@chakra-ui/react'
import { Dispatch, SetStateAction } from "react";
import { MdCode } from "react-icons/md";

import { floorNormalize, floor } from '../../../Util';
import Indicator from './Indicator';
import { useCoinDeposited, useStore } from '../../../store'

interface Props {
  amount: string,
  setAmount: Dispatch<SetStateAction<string>>,
}
const SliderWish: FunctionComponent<Props> = ({  amount, setAmount }) => {
  const {state, dispatch} = useStore();
  const ustDeposited = useCoinDeposited()[state.coinType] + floorNormalize(state.userInfoCoin[state.coinType].reward_amount);

  const [sliderValue, setSliderValue] = useState(0);
  
  useEffect(() => {
    let balance = ustDeposited;

    if(parseFloat(amount) > 0)
    {
      let percent = Math.floor(parseFloat(amount) * 100 / balance);
      if (percent > 100) percent = 100;
      setSliderValue(percent);
    }
    else
      setSliderValue(0)

  }, [amount]);

  const onChangeSlider = (value: number) => {
    setSliderValue(value);
    let balance = ustDeposited;
    setAmount(floor(balance * value / 100).toString());
  }
  return (
    <Flex
      direction={'column'}
      rounded={'10px'}
      w={'100%'}
      h={'45px'}
      mt={'58px'}
      align={'center'}
      justify={'space-between'}
    >
      {/* <HStack
        w={'100%'}
        h={'48px'}
        justify={'space-between'}
        position={'relative'}
      >
        <Indicator>25%</Indicator>
        <Indicator>50%</Indicator>
        <Indicator>75%</Indicator>
        <Indicator>100%</Indicator>
      </HStack> */}
      <Slider
        aria-label='slider-ex-4'
        min={0}
        max={100}
        focusThumbOnChange={false}
        onChange={(value) => onChangeSlider(value)}
        value={sliderValue} 
      >
        <Indicator value={25} />
        <Indicator value={50} />
        <Indicator value={75} />
        <Indicator value={100} />
        <SliderMark
          value={sliderValue}
          textAlign='center'
          color='#F9D85E'
          fontSize='8px'
          mt='-5'
          ml='-6'
          w='12'
        >
          {sliderValue}%
        </SliderMark>

        <SliderTrack bg='#493C3C' h={'12px'} w={'101% !important'} rounded={'15px'}>
          <SliderFilledTrack bg='#F9D85E' />
        </SliderTrack>
        <SliderThumb boxSize={5} bg='#F9D85E'>
          <Box color='black' as={MdCode} />
        </SliderThumb>
      </Slider>
    </Flex>
  );
}
export default SliderWish;