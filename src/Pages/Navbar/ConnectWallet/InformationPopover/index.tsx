import React, { FunctionComponent, useEffect, useState } from 'react';
import { VStack, Flex, HStack, Image, Text, Divider, Button } from '@chakra-ui/react'
import { MsgExecuteContract, WasmAPI, Coin } from '@terra-money/terra.js'
import {
  PopoverContent,
} from '@chakra-ui/react'
import { MdMail, MdCallMade, MdKeyboardArrowRight } from 'react-icons/md';

import Satellite from '../../../../assets/Satellite.png'
import Line from '../../../../assets/Line.svg'
import { shortenAddress, floorNormalize } from '../../../../Util';
import { useStore, useWallet, useUSTBalance, useLUNABalance, useLCD } from '../../../../store';
import { VUST, VLUNA } from '../../../../constants';

interface Props {
  isOpen: boolean,
  onClose: () => void,
  connectTo: (to: string) => void,
}
const InformationPopover: FunctionComponent<Props> = ({ isOpen, onClose, connectTo }) => {
  const { state, dispatch } = useStore();
  const [vust, setVust] = useState(0);
  const [vluna, setVluna] = useState(0);

  const wallet = useWallet();
  const ustBalance = useUSTBalance();
  const lunaBalance = useLUNABalance();
  const lcd = useLCD();

  useEffect( () => {
    const fetch = async () => {
      const api = new WasmAPI(lcd.apiRequester);
      let balance: any;
      try {
        balance = await api.contractQuery(
          VUST,
          {
            balance: {address: wallet?.walletAddress}
          });
        
        setVust(floorNormalize(parseInt(balance.balance)));
      } catch (e) { 
        console.log(e)
      }

      try {
        balance = await api.contractQuery(
          VLUNA,
          {
            balance: {address: wallet?.walletAddress}
          });
        
        setVluna(floorNormalize(parseInt(balance.balance)));
      } catch (e) { 
        console.log(e)
      }
    }

    fetch();
  }, [lcd.apiRequester, wallet?.walletAddress]);

  return (
    <PopoverContent
      rounded={'25px'}
      w={{ sm: '80%', md: '260px', lg: '260x' }}
      minW={{ sm: '80%', md: '260x', lg: '260x' }}
      background={'#493C3C'}
      letterSpacing={'0em'}
      border={'none'}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        w={'100%'}
        direction={'column'}
        px={{ sm: '10px', md: '28px', lg: '28px' }}
        py={'32px'}
      >
        <Flex w={'100%'} justify={'center'} >
          <Text
            fontSize={'9px'}
            fontWeight={'400'}
            lineHeight={'10px'}
            color={'#F9D85E'}
          >
            TERRA STATION WALLET
          </Text>
        </Flex>
        <HStack w={'100%'}>
          <Flex 
            w={'38px'} 
            minW={'38px'} 
            h={'38px'} 
            rounded={'50%'} 
            justify={'center'} 
            align={'center'} 
            background={'#212121'}
          >
            <MdMail />
          </Flex>
          <Divider mt={'23px'} orientation='horizontal' variant={'dashed'} color={'#CEC0C0'} />
          <Flex 
            w={'38px'} 
            minW={'38px'} 
            h={'38px'} 
            rounded={'50%'} 
            justify={'center'} 
            align={'center'} 
            background={'#212121'}
          >
            <Image src={Satellite} w={'16px'} h={'16px'}/>
          </Flex>
        </HStack>
        <VStack align={'baseline'} w={'100%'}>
          <Text
            mt={'15px'}
            fontSize={'18px'}
            fontWeight={'400'}
            lineHeight={'20px'}
            color={'white'}
          >
            {shortenAddress(wallet?.walletAddress)}
          </Text>
          <Button w={'95px'} h={'21px'} color={'#F9D85E'} background={'#2e2525'} fontSize={'9px'}>
            COPY ADDRESS
          </Button>
        </VStack>
        <VStack w={'100%'}  color={'#CEC0C0'} fontSize={'12px'}>
          <Divider mt={'30px'} orientation='horizontal'/>
          <Flex w={'100%'} justify={'space-between'}>
            <Text> LUNA </Text>
            <Text> {lunaBalance} </Text>
          </Flex>
          <Divider mt={'30px'} orientation='horizontal'/>
          <Flex w={'100%'} justify={'space-between'}>
            <HStack w={'100%'}>
              <Text>UST</Text>
              <Button 
                w={'30px'} 
                h={'15px'} 
                background={'none'} 
                p={'0px'}
              >
                <Text fontSize={'9px'} color={'#F9D85E'}>
                  BUY 
                </Text>
                <MdCallMade color={'#F9D85E'} size={'9px'}/> 
              </Button>
            </HStack>
            <Text> {ustBalance} </Text>
          </Flex>
          <Divider mt={'30px'} orientation='horizontal'/>
          <Flex w={'100%'} justify={'space-between'}>
            <Text> xyzUST </Text>
            <Text> {vust} </Text>
          </Flex>
          <Divider mt={'30px'} orientation='horizontal'/>
          <Flex w={'100%'} justify={'space-between'}>
            <Text> xyzLUNA </Text>
            <Text> {vluna} </Text>
          </Flex>
          <HStack w={'100%'} h={'28px'} rounded={'25px'} spacing={'0px'} background={'#F9D85E'}  mt={'10px'}>
            <Flex w={'141px'} minW={'141px'} justify={'center'}>
              <a href={'https://bridge.terra.money/'} target={'blank'}>
              <Text fontSize={'14px'} color={'white'}>
                Terra Bridge
              </Text>
              </a>
            </Flex>
            <Divider orientation='vertical' borderColor={'#493C3C'}/>
            <Flex w={'100%'} justify={'center'} align={'center'}>
              <a href={'https://docs.anchorprotocol.com/user-guide/interchain-transfers'} target={'blank'}>
              <Text fontSize={'12px'} color={'white'}>
                Docs
              </Text>
              </a>
              <a href={'https://docs.anchorprotocol.com/user-guide/interchain-transfers'} target={'blank'}>
              <MdCallMade color={'white'} size={'12px'}/> 
              </a>
            </Flex>
          </HStack>
          <Button w={'100%'} h={'28px'} rounded={'25px'} background={'#F9D85E'}  mt={'10px'}>
            <Text fontSize={'14px'} color={'white'}>
              SEND
            </Text>
          </Button>

          <a href={'https://terrasco.pe/bombay-12/address/' + wallet?.walletAddress} target={'blank'}>
          <HStack>
            <Text>View on Terra Finder</Text>
            <Flex w={'16px'} background={'#2e2525'} justify={'center'} align={'center'} rounded={'50%'}>
              <MdKeyboardArrowRight size={'11px'}/>
            </Flex>
          </HStack>
          </a>
        </VStack>
      </Flex>
      <Flex
        w={'100%'}
        h={'34px'}
        background={'#2e2525'}
        justify={'center'}
        align={'center'}
        rounded={'0 0 25px 25px'}
        _hover={{background:'#3f3434'}}
        cursor={'pointer'}
        onClick={() => connectTo('disconnect')}
      >
        <Text
          fontSize={'12px'}
          fontWeight={'400'}
          lineHeight={'10px'}
          color={'#CEC0C0'}
        >
          Disconnect
        </Text>
      </Flex>
    </PopoverContent>
  );
}
export default InformationPopover;

