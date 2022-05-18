import React, { FunctionComponent } from 'react';
import { HStack, Stack, Flex, Text, Image, Link } from '@chakra-ui/react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props{
  data: any[]
}
const EarnChart: FunctionComponent<Props> = ({data}) => {
  return (
    <Flex w='100%' h='304px'>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          // width={500}
          // height={400}
          data={data}
          // margin={{
          //   top: 10,
          //   right: 30,
          //   left: 0,
          //   bottom: 0,
          // }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0A939636" stopOpacity={21}/>
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          {/* <XAxis dataKey="time" /> */}
          {/* <YAxis /> */}
          {/* <Tooltip /> */}
          <Area 
            type="monotone" 
            dataKey="value1" 
            stroke="#F9D85E" 
            fill="url(#colorUv)" 
          />
          <Area 
            type="monotone" 
            dataKey="value2" 
            stroke="black" 
            fill="none" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Flex>
  );
}
export default EarnChart;