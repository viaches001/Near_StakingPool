import React, { FunctionComponent, useState, useMemo, useEffect } from 'react';
import { Flex, Text, Button, Image, Spinner, useDisclosure } from '@chakra-ui/react'
import {
  Popover,
  PopoverTrigger,
} from '@chakra-ui/react'
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider'
import { LCDClient, WasmAPI, Coins, Coin } from '@terra-money/terra.js'
import { toast } from 'react-toastify';
import {MdOutlineAccountBalanceWallet} from 'react-icons/md'

import Wallet from './../../../assets/Wallet.svg';
import { useStore, ActionKind, useCoinBalance } from '../../../store';
import { shortenAddress, floorNormalize } from '../../../Util';


const ConnectWallet: FunctionComponent = () => {
  const { state, dispatch } = useStore();
  const [bank, setBank] = useState(false);
  const { isOpen: isOpenInfomation, onOpen: onOpenInfomation, onClose: onCloseInfomation } = useDisclosure();

  const wallet = useWallet()
  const connectedWallet = useConnectedWallet()
  // const ustBalance = useCoinBalance();

  const lcd = useMemo(() => {
    if (!connectedWallet) {
      dispatch({ type: ActionKind.setConnected, payload: false });
      dispatch({ type: ActionKind.setWallet, payload: undefined });

      return undefined;
    }
    dispatch({ type: ActionKind.setConnected, payload: true });
    dispatch({ type: ActionKind.setWallet, payload: connectedWallet });
    
    let lcd =  new LCDClient({
      URL: connectedWallet.network.lcd,
      chainID: connectedWallet.network.chainID,
    })
    dispatch({ type: ActionKind.setLcd, payload: lcd });

    return lcd;
  }, [connectedWallet, dispatch])

  useEffect(() => {
    async function fetchBalance() {
      if (connectedWallet?.walletAddress && lcd) {
        let coins: Coins;
        try {
          [coins,] = await lcd.bank.balance(connectedWallet.walletAddress);
        } catch (e) {
          toast("Can't fetch Wallet balance");
          return;
        }
        setBank(true);
        if (coins.get('uusd')) {
          dispatch({type: ActionKind.setUCoinBalance, payload: coins.get('uusd')?.amount.toNumber()});
        }
      }
    }

    if (connectedWallet && lcd) {
      fetchBalance()
    }
  }, [connectedWallet, lcd, dispatch, state.loading])

  function connectTo(to: string) {
    if (to === 'extension') {
      wallet.connect(wallet.availableConnectTypes[0])
    } else if (to === 'mobile') {
      wallet.connect(wallet.availableConnectTypes[1])
    } else if (to === 'disconnect') {
      wallet.disconnect()
      // dispatch({ type: 'setWallet', message: {} })
    }
  }

  return (
    <>
      {!state.connected && 
        <Button
          fontSize={'15px'}
          fontWeight={'700'}
          width={'171px'}
          height={'36px'}
          background={'none'}
          border={'solid 2px #F9D85E'}
          rounded={'25px'}
          onClick={() => { connectTo('extension') }}
        >
        <Image src={Wallet} width={'15px'} />
          <Text ml={'11px'} color={'#F9D85E'}>
            Connect Wallet
          </Text>
        </Button>
      }
      {state.connected &&
        <Popover>
          <PopoverTrigger>
            <Button
              fontSize={'15px'}
              fontWeight={'700'}
              // width={'171px'}
              height={'36px'}
              background={'none'}
              border={'solid 2px #F9D85E'}
              rounded={'25px'}
              onClick={() => { onOpenInfomation() }}
            >
              {(bank && !state.loading) &&
                <MdOutlineAccountBalanceWallet size={25} color={'#F9D85E'}/>
              }
              {(!bank || state.loading) && 
                <Spinner color={'#F9D85E'}/>
              }
              <Text ml={'15px'} color={'#F9D85E'}>
                {shortenAddress(connectedWallet?.walletAddress.toString())}
                &nbsp;|&nbsp;
                {100}&nbsp;NEAR
              </Text>
            </Button>
          </PopoverTrigger>
        </Popover>
      } 
    </>
  );
}

export default ConnectWallet;