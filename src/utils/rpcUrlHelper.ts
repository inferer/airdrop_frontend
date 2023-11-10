import { CHAIN_ID, RPC_URLS_ID } from "@/config"
import { ethers } from "ethers"

export const rpcUrl = RPC_URLS_ID[CHAIN_ID]

export const rpcProvider = new ethers.JsonRpcProvider(rpcUrl)

export const getSignProvider = () => {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.ethereum) {
    // @ts-ignore
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}