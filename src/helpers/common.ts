import { BigNumber } from '@0x/utils';
import { WalletData } from './../interfaces/WalletData';
import axiosInstance from '../config/config';
const commaNumber = require('comma-number');
const ethers = require('ethers');

export const encodeParameters = (types: any[], values: any[]) => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

export const getArgs = (param: any) => {
  // First match everything inside the function argument parens.
  const args = param.toString().match(/.*?\(([^)]*)\)/)
    ? param.toString().match(/.*?\(([^)]*)\)/)[1]
    : '';
  // Split the arguments string into an array comma delimited.
  return args
    .split(',')
    .map((arg: string) => {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim();
    })
    .filter((arg: any) => {
      // Ensure no undefined values are added.
      return arg;
    });
};

export const currentAddress = (wallet: WalletData) => {
  const allValue = Object.values(wallet);
  return allValue.filter((item) => typeof item === 'string' && item.length !== 0)[0] || '';
};

export const format = commaNumber.bindWith(',', '.');

export const currencyFormatter = (labelValue: any) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? `${format(new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e9}`).dp(2, 1))}B`
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? `${format(new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e6}`).dp(2, 1))}M`
    : // Three Zeroes for Thousands
      format(labelValue.toFixed(4));
};

export const getStatus = (state: string) => {
  if (state === 'Executed') {
    return 'Passed';
  }
  if (state === 'Active') {
    return 'Active';
  }
  if (state === 'Defeated') {
    return 'Failed';
  }
  return state;
};

export const dateBeforeMonth = (date: Date, num: number): Date => {
  date.setMonth(date.getMonth() - num);
  return date;
};

export const convertToDate = (param: number) => {
  return `${new Date(param).getFullYear()} - ${new Date(param).getMonth() + 1} - ${new Date(
    param
  ).getDate()}`;
};

export const checkNotEmptyArr = (array: any[]) => {
  return Array.isArray(array) && array.length > 0;
};

export const removeManyItemsInLS = (key: string) => {
  Object.keys(localStorage).forEach((name) => {
    if (name.includes(key)) {
      localStorage.removeItem(name);
    }
  });
};

export const stringToArr = (param: string) => {
  const sub = param.substring(param.indexOf('(')+1, param.indexOf(')'));
  return sub.split(',').map(item => item.trim());
}
const options = {
  header: {
    'X-CMC_PRO_API_KEY': `${process.env.REACT_APP_COINMARKETCAP_API_KEY}`
  }
}

export const convertDateToString = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const convertOHCLdata = (data: Array<any>, selectedCurrency: string) => {
  return data.reduce((response, item) => {
    response.push(
      {
        price: item?.quote[selectedCurrency.toUpperCase()].close,
        time: item?.time_close
    });
    return response;
  }, []);
}

export const addMissingDataOHCL = (data: Array<any>, startDate: Date, endDate: Date) => {
  let response: any[] = [];
  let start = new Date(convertDateToEndDay(startDate)).getTime();
  const end = new Date(convertDateToEndDay(endDate)).getTime();
  const firstDataTime = new Date(data[0].time).getTime();
  let endDataTime = new Date(data[data.length - 1].time).getTime();
  
  while (start < firstDataTime) {
    response.push(0);
    start += 24*60*60*1000;
  }
  response = response.concat(data.map((item: any) => item.price));
  while (end > endDataTime) {
    response.push(data[data.length - 1].price);
    endDataTime += 24*60*60*1000;
  }
  return response;
}
export const convertDateToEndDay = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}T23:59:59.999Z`;
}