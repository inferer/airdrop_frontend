import { fetcher, poster } from '@/utils/axios'
import { create } from 'zustand'
import { IResult, UserState } from './types'

const useUserStore = create<UserState>()((set, get) => ({
  userId: '',
  nftBaseInfo: {},
  register: async (account: string) => {
    const res = await poster(`/plugin/register`, {chrome_id: account})
    if (res.status === 200 && res.result && res.result.user_id) {
      set({ userId: res.result.user_id })
    }
  },
  getUserID: async (account: string) => {
    const res = await fetcher('/plugin/getUserID', { chrome_id: account })

    if (res.status === 200 && res.result && res.result.user_id) {
      set({ userId: res.result.user_id })
    } else {
      get().register(account)
    }
  },
  getUserNonce: async (account: string) => {
    const res = await fetcher(`/api/user/nonce/${account}`)

    return res
  },
  verifyUserNonce: async (account: string, sign: string) => {
    const res = await poster(`/api/user/verify`, { address: account, sign })

    return res
  },
  
}))

export default useUserStore