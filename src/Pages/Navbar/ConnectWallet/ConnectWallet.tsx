import React, { FunctionComponent, useState, useMemo, useEffect, useCallback } from 'react';
import { Flex, Text, Button, Image, Spinner, useDisclosure } from '@chakra-ui/react'
import {
  Popover,
  PopoverTrigger,
} from '@chakra-ui/react'
import { toast } from 'react-toastify';
import {MdOutlineAccountBalanceWallet} from 'react-icons/md'
import Wallet from './../../../assets/Wallet.svg';
import { useStore, ActionKind, useCoinBalance } from '../../../store';
import { shortenAddress, floorNormalize } from '../../../Util';
import * as nearAPI from "near-api-js";
import { useWalletSelector } from '../../../context/WalletSelectorContext';
import { AccountView } from "near-api-js/lib/providers/provider";
import { providers, utils } from "near-api-js";

type Account = AccountView & {
  account_id: string;
};

const ConnectWallet: FunctionComponent = () => {
  const { state, dispatch } = useStore();
  const [bank, setBank] = useState(false);
  const { isOpen: isOpenInfomation, onOpen: onOpenInfomation, onClose: onCloseInfomation } = useDisclosure();
  const { selector, accounts, accountId, setAccountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { nodeUrl } = selector.network;
    const provider = new providers.JsonRpcProvider({ url: nodeUrl });

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.network]);

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setLoading(false);
    });
  }, [accountId, getAccount]);

  // const lcd:any = useMemo(() => {
  //   if (!accountId) {
  //     dispatch({ type: ActionKind.setConnected, payload: false });

  //     return undefined;
  //   }
  //   dispatch({ type: ActionKind.setConnected, payload: true });
  //   // dispatch({ type: ActionKind.setConnectedWallet, payload: selector });
  //   return lcd;
  // }, [accountId, dispatch])

  // useEffect(() => {
  //   async function fetchBalance() {
  //     if (accountId && lcd) {
  //       try {
  //         [coins,] = await lcd.bank.balance(connectedWallet.walletAddress);
  //       } catch (e) {
  //         toast("Can't fetch Wallet balance");
  //         return;
  //       }
  //       setBank(true);
  //       if (coins.get('uusd')) {
  //         dispatch({type: ActionKind.setUusdBalance, payload: coins.get('uusd')?.amount.toNumber()});
  //       }
  //       if (coins.get('uluna')) {
  //         dispatch({type: ActionKind.setUlunaBalance, payload: coins.get('uluna')?.amount.toNumber()});
  //       }
  //     }
  //   }

  //   if (connectedWallet && lcd) {
  //     fetchBalance()
  //   }
  // }, [lcd, accountId, dispatch, state.loading])

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
          onClick={() => { selector?.show(); }}
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
  
                {/* {shortenAddress(connectedWallet?.walletAddress.toString())} */}
                {shortenAddress(accountId?.toString())}
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