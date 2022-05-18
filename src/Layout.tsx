import React, { useEffect, useMemo } from 'react'
import { QueryClient, QueryClientProvider, useInfiniteQuery } from "react-query"
import { Outlet, Link } from "react-router-dom";
import { VStack, Flex, useDisclosure, useEventListenerMap } from '@chakra-ui/react'
import { useLCD, useWallet, useTerraAPIURL, useStore, useNetworkName, ActionKind } from './store';

import Navbar from './Pages/Navbar'
import Footer from "./Pages/Footer";
import DepositModal from './Pages/DepositModal'
import WithdrawModal from './Pages/WithdrawModal'
import WaitingModal from './Pages/WaitingModal';
import { fetchData, checkNetwork } from './Util';

const Layout = () => {
  const networkName = useNetworkName();
  const queryClient = useQueryClient();

  const { isOpen: isOpenDeposit, onOpen: onOpenDeposit, onClose: onCloseDeposit } = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseWithdraw } = useDisclosure();
  const { isOpen: isOpenWaiting, onOpen: onOpenWaiting, onClose: onCloseWaiting } = useDisclosure();

  const { state, dispatch } = useStore();
  const lcd = useLCD();
  const wallet = useWallet();

  useEffect(() => {
    dispatch({ type: ActionKind.setOpenDepositModal, payload: onOpenDeposit });
    dispatch({ type: ActionKind.setOpenWithdrawModal, payload: onOpenWithdraw });
    dispatch({ type: ActionKind.setOpenWaitingModal, payload: onOpenWaiting });
    dispatch({ type: ActionKind.setCloseWaitingModal, payload: onCloseWaiting });
  }, [dispatch, onOpenDeposit, onOpenWithdraw, onOpenWaiting, onCloseWaiting])

  useEffect(() => {
    const fetchAll = async () => {
      fetchData(state, dispatch)
    }
    if (checkNetwork(wallet, state))
      fetchAll()
  }, [lcd, wallet])

  return (
    <QueryClientProvider client={queryClient} key={networkName}>
      <Flex
        background={'black'}
        justify={'center'}
        w={'100%'}
      >
        <VStack
          fontFamily={'SF-Pro-Text'}
          fontStyle={'normal'}
          letterSpacing={'-0.06em'}
          spacing={'10px'}
          color={'white'}
          maxWidth={'1440px'}
          w = {'100%'}
        >
          <Navbar />
          <Outlet />
          <Footer />
          <DepositModal isOpen={isOpenDeposit} onClose={onCloseDeposit} />
          <WithdrawModal isOpen={isOpenWithdraw} onClose={onCloseWithdraw} />
          <WaitingModal isOpen={isOpenWaiting} onClose={onCloseWaiting} />
        </VStack>
      </Flex>
    </QueryClientProvider>
  )
};
export default Layout;


const useQueryClient = () => {
  const name = useNetworkName()

  return useMemo(() => {
    if (!name) throw new Error()
    return new QueryClient()
  }, [name])
}
