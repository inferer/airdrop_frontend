import { ethers } from "ethers";
import { rpcProvider, getSignProvider } from "./rpcUrlHelper";

import IFRAirdropAbi from '@/config/abi/IFRAirdrop.json'
import ERC20Abi from '@/config/abi/ERC20.json'
import { getIFRAirdropAddress, getIFRTokenAddress } from "./addressHelpers";


export const getContract = async (abi: any, address: string, signer?: any) => {
  const signProvider = getSignProvider()
  const provider = signer || rpcProvider
  // const signer = await provider.getSigner();
  return new ethers.Contract(address, abi, signProvider ? await signProvider?.getSigner() : rpcProvider)
}

export const getERC20Contract = (address: string, signer?: any) => {
  return getContract(ERC20Abi, address, signer)
}

export const getIFRAirdropContract = (sign?: boolean) => {
  return getContract(IFRAirdropAbi, getIFRAirdropAddress(), sign)
}

export const getIFRTokenContract = (sign?: boolean) => {
  return getERC20Contract(getIFRTokenAddress(), sign)
}

