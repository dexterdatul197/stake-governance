import { BigNumber } from '@0x/utils';
import { WalletData } from './../interfaces/WalletData';
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

export const convertOHCL = (data: any[]) => {
  const res = data.reduce((res: any[], e: any) => {
    const date = convertToDate(e[0]);
    const existDate = res.filter((item: any) => convertToDate(item[0]) === date);
    if (existDate.length === 0) {
      res.push(e);
    } else {
      const childExistDate: any = existDate[0];
      childExistDate[1] = Math.max(childExistDate[1], e[1]);
      childExistDate[2] = Math.max(childExistDate[2], e[2]);
      childExistDate[3] = Math.max(childExistDate[3], e[3]);
      childExistDate[4] = Math.max(childExistDate[1], e[4]);
    }
    return res;
  }, []);
  return res;
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
