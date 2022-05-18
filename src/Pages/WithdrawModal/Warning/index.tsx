import React, { FunctionComponent, useState } from 'react';
import { Stack, VStack, Flex, HStack, Button, Text, Divider, Image, Checkbox } from '@chakra-ui/react'
import { Deposit, MsgExecuteContract, WasmAPI, Coin } from '@terra-money/terra.js'
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react'
import {toast} from 'react-toastify'
import {MdWarningAmber, MdInfoOutline} from 'react-icons/md'

import { useStore, useWallet, useLCD, ActionKind } from '../../../store';
import {estimateSend, fetchData, sleep} from '../../../Util';
import { successOption, errorOption, REQUEST_ENDPOINT, VUST, VLUNA, MOTHER_WALLET } from '../../../constants';
import CustomCheckbox from './CustomCheckbox';

interface Props{
  isOpen: boolean,
  onClose: () => void,
  onCloseParent: () => void,
  amount: string,
}
const WarningModal: FunctionComponent<Props> = ({isOpen, onClose, amount, onCloseParent}) => {
  const [checked, setChecked] = useState(false);
  const {state, dispatch} = useStore();
  const wallet = useWallet();
  const lcd = useLCD();
  const coinType = state.coinType;

  const withdraw = async () => {
    if(checked == false || wallet == undefined)
      return;
      
    let val = Math.floor(parseFloat(amount) * 10 ** 6);
    let withdraw_msg = new MsgExecuteContract(
      wallet?.walletAddress,
      coinType == 'usdc' ? VUST : VLUNA,
      {
        "increase_allowance": {
            "spender": `${MOTHER_WALLET}`,
            "amount": `${val}`,
            "expires": {
                "never": {}
            }
        }
      },
      {}
    );
    let res = await estimateSend(wallet, lcd, [withdraw_msg], "Success request withdraw", "request withdraw");
    if(res)
    {
      dispatch({type: ActionKind.setTxhash, payload: res});

      onClose();
      onCloseParent();
      if(state.openWaitingModal)
        state.openWaitingModal();

      let count = 10;
      let height = 0;
      while (count > 0) {
        await lcd.tx.txInfo(res)
          // eslint-disable-next-line no-loop-func
          .then((e) => {
            if (e.height > 0) {
              toast.dismiss();
              toast("Success request withdraw", successOption);
              height = e.height;
            }
          })
          .catch((e) => {})

        if (height > 0) break;

        await sleep(1000);
        count--;
      }

      var formData = new FormData()
      formData.append('wallet', wallet.walletAddress.toString());
      formData.append('coinType', coinType)
      formData.append('amount', val.toString())

      await axios.post(REQUEST_ENDPOINT + 'withdraw', formData, {timeout: 60 * 60 * 1000})
      .then((res) => {
        toast("Withdraw success", successOption)
        if(state.closeWaitingModal)
          state.closeWaitingModal();
        fetchData(state, dispatch)
      })
      .catch(function (error) {
        if (error.response) {
          toast(error.response.data.data.message, errorOption)
        } else if (error.request) {
          toast(error.request, errorOption);
          fetchData(state, dispatch)
        } else {
          toast(error.message, errorOption);
        }
        if(state.closeWaitingModal)
          state.closeWaitingModal();
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent 
        background={'#212121'}
        rounded={'25px'}
        w={{sm:'80%', md: '562px', lg:'562px'}}
        minW={{sm:'80%', md: '562px', lg:'562px'}}
        h={'413px'}
        px={{sm:'10px', md: '47px', lg: '47px'}}
        py={'39px'}
      >
        <HStack
          color={'white'}
          justifyContent={'center'}
          mx={'100px'}
          spacing={'8px'}
        >
          <Text
            fontSize={'20px'}
            fontWeight={'860'}
            lineHeight={'20px'}
          >
            WITHDRAW WARNING
          </Text>
          <MdWarningAmber size={20}/>
        </HStack>
        <VStack
          mt={'46px'}
          background={'#493C3C'}
          px={'20px'}
          py={'25px'}
          align={'baseline'}
          rounded={'15px'}
        >
          <Text
            fontSize={'13px'}
            fontWeight={'860'}
            lineHeight={'15px'}
            color={'#CEBFBF'}
          >
            Are you really sure you want to withdraw?
            You may lose your valuable share of the Community Farming Event and your eligibility for the Rewards+ Program.
          </Text>
          <HStack color={'#F9D85E'}>
            <Text
              fontSize={'13px'}
              fontWeight={'700'}
              lineHeight={'13px'}
            >
              Learn more about your benefits 
            </Text>
            <MdInfoOutline />
          </HStack>
        </VStack>
        <Divider mt={'47px'} orientation='horizontal' variant={'dashed'} color={'#CEC0C0'} />
        <Stack mt={'34px'} 
          direction={{sm: 'column', md: 'row', lg:'row'}}
          spacing={'35px'}
        >
          <HStack>
            <CustomCheckbox checked={checked} setChecked={setChecked} />
            <Text
              fontSize={'9px'}
              fontWeight={'400'}
              lineHeight={'11px'}
              color={'#CEC0C0'} 
              w={{sm: '100%', md:'118px', lg:'118px'}}
            >
              Please check the box if you understand that you are losing your benefits
            </Text>
          </HStack>
          <Button 
            w={'100%'} 
            h={'45px'} 
            background={'#493C3C'} 
            rounded={'25px'}
            onClick={() => withdraw()}
          >
            <Text
              fontSize={'13px'}
              fontWeight={'860'}
              lineHeight={'15px'}
              color={'white'}
            >
              YES, I WANT TO LOOSE MY BENEFITS!
            </Text>
          </Button>
        </Stack>
        <ModalCloseButton color={'#CEBFBF'} />
      </ModalContent>
    </Modal>
  );
}
export default WarningModal;

