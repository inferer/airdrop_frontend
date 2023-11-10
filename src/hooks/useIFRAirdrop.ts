import { useCallback } from "react"
import { useERC20, useIFRAirdropContract } from "./useContract"
import { getIFRAirdropAddress, getIFRTokenAddress } from "@/utils/addressHelpers"
import useActiveWeb3React from "./useActiveWeb3React"
import { useApproveIFRAirdrop } from "./useApproveIFRAirdrop"
import { useUserStore } from "@/state"
import { useCallWithGasPrice } from "./useCallWithGasPrice"


export const useIFRAirdrop = () => {
  const getAccountProof = useUserStore(state => state.getAccountProof)
  const { account } = useActiveWeb3React()
  const IFRTokenAddress = getIFRTokenAddress()
  const IFRToken = useERC20(IFRTokenAddress, true)
  const IFRAirdropAddress = getIFRAirdropAddress()
  const { handleApprove, approvalStatus } = useApproveIFRAirdrop(IFRTokenAddress)
  const IFRAridropContract = useIFRAirdropContract()
  const { callWithGasPrice } = useCallWithGasPrice()


  const handleGetAllowance = useCallback(async () => {
    const tokenContract = await IFRToken
    if (account && tokenContract) {
      console.log(account, IFRAirdropAddress)
      const allowance = await tokenContract.allowance(account, IFRAirdropAddress)
      return allowance
    }
  }, [IFRToken, account])


  const handleClaim = useCallback(async () => {
    if (account) {
      try {
        const allowance = await handleGetAllowance()
        console.log(allowance)
        if (Number(allowance) <= 0) {
          await handleApprove()
          return
        }
        const res = await getAccountProof(account, IFRTokenAddress)
        console.log(res)
        if (res.code === 0) {
          if (res.data && res.data.hexProof) {
            // const claimRes = await (await IFRAridropContract).claim(IFRTokenAddress, res.data.hexProof)
            const claimRes = await callWithGasPrice(await IFRAridropContract, 'claim', [IFRTokenAddress, res.data.hexProof], { from: account, gasLimit: '300000' })

            const receipt = await claimRes.wait()
            if (receipt.status) {
              alert('Success')
            }
          }
        }
      } catch(e) {
        console.log(e)
      }
      

    }
  }, [
    account,
    handleGetAllowance
  ])


  return {
    handleGetAllowance,
    handleClaim,
    approvalStatus
  }

}