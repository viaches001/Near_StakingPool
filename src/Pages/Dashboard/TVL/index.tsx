import React, { FunctionComponent, useEffect, useState } from 'react';
import { HStack, Stack, VStack, Flex, Text, Image, Link, Center, Divider, Tooltip } from '@chakra-ui/react';
import axios from "axios";

import AnimationNumber from '../../Components/AnimationNumber';
import TVLChart from './TVLChart';

const TVL: FunctionComponent = (props) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect( () => {
    const fetchData = async () => {
      const data: any = await axios.get(
        "https://api.llama.fi/charts/Near"
      );
      return data;
    }

    fetchData().then((res) => {
      setData(res.data);

      let last = res.data.length-1;
      setTotal(res.data[last].totalLiquidityUSD);
    })
  }, [])

  return (
    <Flex 
      pt={'52px'} 
      w={'100%'}
      h={'100%'}
      rounded={'25px'} 
      background={'#212121'} 
      px={{sm:'10px', md:'20px', lg:'50px'}}
      py={{sm:'10px', md:'20px', lg:'59px'}}
      align={'baseline'}
    >
      <VStack
        position={"absolute"}
        align={'baseline'}
      >
        <Text
          fontSize={'20px'}
          fontWeight={'800'}
          lineHeight={'24px'}
        >
          TVL OF THE ENTIRE ECOSYSTEM 
        </Text>
        <HStack spacing={'5px'} align={'baseline'}>
          <Text
            fontSize={'35px'}
            fontWeight={'800'}
            lineHeight={'36px'}
          >
            <AnimationNumber value={total} />
          </Text>
          <Text
            fontSize={'15px'}
            fontWeight={'800'}
            lineHeight={'36px'}
          >
            USD
          </Text>
        </HStack>
      </VStack>
      <TVLChart data={data} id="TVL" />
    </Flex>
  );
}
export default TVL;