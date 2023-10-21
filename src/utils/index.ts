import moment from "moment"
import Web3 from "web3"

export function formatAddress(address: string = '') {
  return address.slice(0, 6) + '...' + address.slice(-4)
}


export const formatName = (name: string = '') => {
  if (name.length <= 20) return name
  return name.slice(0, 12) + '...'
}

export function formatNumber(num: number) {
  return num >= 1e3 ? (num / 1e3).toFixed(1) + 'k' : num.toFixed(1)
}


export const numMonth: any = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

export function num2Month(num: string) {
  return numMonth[num]
}

export function addZero(m: number) {
  return m < 10 ? '0' + m : m;
}

export function transformTime(timestamp: number) {
  var time = new Date(timestamp);
  var y = time.getFullYear();
  var M = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();

  return addZero(h) + ':' + addZero(m) + ' ' + addZero(M) + "/" + addZero(d) + ' ' + y;
}

export function formatTime(timestamp: number) {
  // return moment(new Date(timestamp)).format('DD/MM/YYYY, HH:mm A')
  return moment(new Date(timestamp)).format('D/M/YYYY, H:m A')
}

export function openBrowser(url: string) {
  window.open(url, '_blank');
}

export function getCoinName(chain_id: string) {
  let coinName = '';
  if (chain_id === '1') {
    coinName = 'ETH';
  } else if (chain_id === '137') {
    coinName = 'MATIC';
  }

  return coinName;
}

export function getChainLogo(chain_id: string) {
  let chainLogo = '';
  if (chain_id === '1') {
    chainLogo = '/images/search/eth.png';
  } else if (chain_id === '137') {
    chainLogo = '/images/search/pol.png';
  }

  return chainLogo;
}

export function toChecksumAddress(address: string) {
  if (!address) return false
  try {
    return Web3.utils.toChecksumAddress(address);
  } catch (err) {
    return false
  }
  
}