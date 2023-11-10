import { useMemo } from "react"
import useActiveWeb3React from "./useActiveWeb3React"
import { getERC20Contract, getIFRAirdropContract } from "@/utils/contractHelper"


export const useERC20 = (address: string, withSignerIfPossible = true) => {
  const { library, account } = useActiveWeb3React()

  return useMemo(async () => {
    return getERC20Contract(address, withSignerIfPossible && library ? library.getSigner() : undefined)
  }, [address, library, withSignerIfPossible])
}


export const useIFRAirdropContract = (withSignerIfPossible?: boolean) => {
  return useMemo(() => {
    return getIFRAirdropContract(withSignerIfPossible)
  }, [withSignerIfPossible])
}