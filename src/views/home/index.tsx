import LazyImage from "@/components/LazyImage"
import Wrap from "@/components/Wrap"
import PageHeader from "@/components/pc/PageHeader"
import { SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { message } from 'antd';
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";
import WalletModal from "@/components/walletmodal/WalletModal";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { useUserStore } from "@/state";

const HomePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [ onPrresent, onDimiss ] = useModal(<WalletModal />)

  const getUserNonce = useUserStore(state => state.getUserNonce)
  const verifyUserNonce = useUserStore(state => state.verifyUserNonce)

  const [startMove, setStartmove] = useState(false)



  const recommendRef = useRef<any>(null)

  useEffect(() => {
    if (account) {
      onDimiss()
    }
  }, [onDimiss, account])

  const handleSign = useCallback(async () => {
    console.log(account)
    if (!account) {
      onPrresent()
      return
    }
    try {
      const from = account;
      const res = await getUserNonce(account)
      if (res.code === 0) {
        const msg = `0x${Buffer.from(res.data.nonce, 'utf8').toString('hex')}`;
        // @ts-ignore
        const sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [msg, from, 'Inferer'],
        });
        console.log(sign)

        const res2 = await verifyUserNonce(account, sign)
        console.log(res2)

      }
      
    } catch (err) {
      console.error(err);
    }
  }, [onPrresent, account])

  return (
    <div>
      {contextHolder}
      <PageHeader />
      <Wrap>
        <div className={` relative`}>
          <div className={`absolute flex transition-all duration-[300ms] ${startMove ? 'top-[34px] left-0 ml-0' : 'top-[161px] left-[50%] -ml-[208px]'} `}>
            <div 
              onClick={e => {
                e.stopPropagation()
                handleSign()
              }}
              className={` cursor-pointer font-fmedium text-[36px] transition-all duration-[300ms] ml-5 gradient1 ${startMove ? ' opacity-0 ' : ' opacity-100 '} `}>Sign login</div>
          </div>

        </div>
      </Wrap>
    </div>
  )
}

export default HomePage

