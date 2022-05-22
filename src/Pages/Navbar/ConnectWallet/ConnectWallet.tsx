import React, { FunctionComponent, useState, useMemo, useEffect, useCallback } from 'react';
import { Flex, Text, Button, Image, Spinner, useDisclosure } from '@chakra-ui/react'
import {
  Popover,
  PopoverTrigger,
} from '@chakra-ui/react'
import { toast } from 'react-toastify';
import {MdOutlineAccountBalanceWallet} from 'react-icons/md'
import Wallet from './../../../assets/Wallet.svg';
import { useStore, ActionKind } from '../../../store';
import { shortenAddress, floorNormalize } from '../../../Util';
import { useWalletSelector } from '../../../context/NearWalletSelectorContext';
import { AccountView, CodeResult } from "near-api-js/lib/providers/provider";
import { providers, utils } from "near-api-js";
import { coins } from '../../../constants'; 

type Account = AccountView & {
  account_id: string
};

const ConnectWallet: FunctionComponent = () => {
  const { state, dispatch } = useStore();
  const [bank, setBank] = useState(false);
  // const { isOpen: isOpenInfomation, onOpen: onOpenInfomation, onClose: onCloseInfomation } = useDisclosure();
  const { selector, accounts, accountId, setAccountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { nodeUrl } = selector.network;
  const provider = new providers.JsonRpcProvider({ url: nodeUrl });

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }
    
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

  const handleSignOut = () => {
    selector.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    }).then(() => {
      dispatch({ type: ActionKind.setConnectedNear, payload: false });
    });
  };

  useEffect(() => {
    async function getBalances() {
      try {
        for(const coin of coins.filter(coin => coin.available)) {
          const res = await provider
          .query<CodeResult>({
            request_type: "call_function",
            account_id: coin.testnet_address,
            method_name: "ft_balance_of",
            args_base64: btoa(JSON.stringify({account_id: accountId})),
            finality: "optimistic",
          })
          
          const amount = JSON.parse(Buffer.from(res.result).toString());
          dispatch({type: ActionKind.setUCoinBalance, payload: { type: coin.name, data: coin.floorNormalize(amount)}});
        }
      }
      catch(e) {console.log(e)}
    }

    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setBank(true);
      setAccount(nextAccount);
      setLoading(false);

      const amount = nextAccount?.amount;
      dispatch({type: ActionKind.setUCoinBalance, payload: { type: 'near', data: floorNormalize(amount as any / 10 ** 18)}});

      if (!accountId) {
        dispatch({ type: ActionKind.setConnectedNear, payload: false });
        return;
      }

      dispatch({ type: ActionKind.setConnectedNear, payload: true });
      dispatch({ type: ActionKind.setNearSelector, payload: selector });

      getBalances();
    });

  }, [accountId, getAccount, dispatch]);

  return (
    <>
      {!state.connectedNear && 
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
      {state.connectedNear &&
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
              // onClick={() => { onOpenInfomation() }}
              onClick={() => { handleSignOut() }}
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
                {state.uCoinBalance.near}&nbsp;NEAR
              </Text>
            </Button>
          </PopoverTrigger>
        </Popover>
      } 
    </>
  );
}

export default ConnectWallet;