import { useCallback, useState } from "react"
import useActiveWeb3React from "./useActiveWeb3React"
import { useCallWithGasPrice } from "./useCallWithGasPrice"
import { useERC20 } from "./useContract"
import { ethers } from "ethers"
import { getIFRAirdropAddress } from "@/utils/addressHelpers"


export const useApproveIFRAirdrop = (tokenAddress: string) => {

  const { account } = useActiveWeb3React()
  const [approvalStatus, setApprovalStatus] = useState(0)
  const { callWithGasPrice  } = useCallWithGasPrice()
  const erc20Token = useERC20(tokenAddress)
  const IFRAirdropAddress = getIFRAirdropAddress()

  const handleApprove = useCallback(async () => {
    if (account) {
      try {
        setApprovalStatus(1)
        console.log(IFRAirdropAddress)
        const tx = await callWithGasPrice(await erc20Token, 'approve', [IFRAirdropAddress, ethers.MaxUint256], { from: account, gasLimit: '300000' })
        let receipt
        if (!tx.hash) {
          setApprovalStatus(-1)
        } else {
          receipt = await tx.wait()
        }
        if (receipt && receipt.status) {
          setApprovalStatus(2)
        } else {
          setApprovalStatus(-1)
        }
      } catch(e) {
        setApprovalStatus(-1)
        console.log(e)
      }
    }
  }, [
    account,
    erc20Token
  ])

  return { approvalStatus, handleApprove }
}