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
import { useIFRAirdrop } from "@/hooks/useIFRAirdrop";

const HomePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [ onPrresent, onDimiss ] = useModal(<WalletModal />)

  const getUserNonce = useUserStore(state => state.getUserNonce)
  const verifyUserNonce = useUserStore(state => state.verifyUserNonce)
  const verifyAirdropToken = useUserStore(state => state.verifyAirdropToken)

  const [tokenAddress, setTokenAddress] = useState('0xf88a517Ca5Cb0db8F6dFe37eE5a8A94ce98220c4')
  const [amount, setAmount] = useState('1000')
  const [labelType, setLabelType] = useState(1)

  const [airdropRes, setAirdropRes] = useState<any>({})

  const {
    handleGetAllowance,
    handleClaim
  } = useIFRAirdrop()


  useEffect(() => {
    if (account) {
      onDimiss()
    }
  }, [onDimiss, account])

  const handleSign = useCallback(async (action?: string) => {
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

        if (action === 'send') {
          return sign
        }
        console.log(sign)

        const res2 = await verifyUserNonce(account, sign)
        console.log(res2)
        if (res2.code === 0) {
          return true
        }
        return false

      }
      
    } catch (err) {
      console.error(err);
    }
  }, [onPrresent, account])

  const handleSend = useCallback(async () => {
    if (account) {
      const signRes = await handleSign('send')
      if (signRes) {
        console.log(signRes)
        const airdropRes = await verifyAirdropToken(tokenAddress, amount, labelType, account, signRes)
        console.log(airdropRes)
        setAirdropRes(airdropRes)
      }
    }
  }, [account, handleSign])



  return (
    <div>
      {contextHolder}
      <PageHeader />
      <Wrap>
        <div className={` relative pb-[200px]`}>
        <div className=" text-right">{account}</div>

          <div className={`flex transition-all duration-[300ms] justify-end`}>
            <div 
              onClick={e => {
                e.stopPropagation()
                handleSign()
              }}
              className={` cursor-pointer font-fmedium text-[26px] transition-all duration-[300ms] ml-5 gradient1 border px-3 py-1`}>Sign login</div>
          </div>
          <div className=" border shadow-md mt-11 p-5">
            <div className=" flex items-center">
              <div>Token address:</div>
              <input value={tokenAddress} onChange={e => {
                e.stopPropagation()
                setTokenAddress(e.target.value)
              }} className="border ml-5 w-[460px] p-2" />
            </div>
            <div className=" flex items-center mt-5">
              <div>Airdrop Amount:</div>
              <input value={amount} onChange={e => {
                e.stopPropagation()
                setAmount(e.target.value)
              }} className="border ml-5 w-[460px] p-2" />
            </div>
            <div className=" flex items-center mt-5">
              <div>Label Type:</div>
              <select className="border ml-5 w-[200px] p-2" 
                value={labelType}
                onChange={e => {
                  e.stopPropagation()
                  setLabelType(Number(e.target.value))
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div className="flex ">
              <button 
                onClick={e => {
                  e.stopPropagation()
                  handleSend()
                }}
                className={` cursor-pointer font-fmedium text-[26px] transition-all duration-[300ms] ml-5 gradient1 mt-14 border px-3 py-1`}>Airdrop</button>
              <button 
                onClick={e => {
                  e.stopPropagation()
                  handleClaim()
                }}
                className={` cursor-pointer font-fmedium text-[26px] transition-all duration-[300ms] ml-5 gradient1 mt-14 border px-3 py-1`}>Claim</button>
            </div>

            <div>
              { airdropRes.code === 0 ? airdropRes.data.rootHash : 'Error'}
            </div>
          </div>

        </div>
      </Wrap>
    </div>
  )
}

export default HomePage

