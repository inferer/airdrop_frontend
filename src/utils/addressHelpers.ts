
import { CHAIN_ID } from '@/config'
import addresses from '@/config/contracts'

export const getAddress = (address: any): string => {
  
  const chainId: string = String(CHAIN_ID)
  return address[chainId] ? address[chainId] : address['1']
}

export const getIFRTokenAddress = () => {
  return getAddress(addresses.IFRToken)
}

export const getIFRAirdropAddress = () => {
  return getAddress(addresses.IFRAirdrop)
}