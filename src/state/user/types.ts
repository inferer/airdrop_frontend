
export interface IResult {
  code: number,
  data: {[key: string]: any},
  msg?: string
}



export interface UserState {
  userId: string,
  nftBaseInfo: {[key: string]: string}
  getUserID: (account: string) => void,
  register: (account: string) => void,
  getUserNonce: (address: string) => any,
  verifyUserNonce: (address: string, sign: string) => any,
}