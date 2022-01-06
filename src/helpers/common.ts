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
    return allValue.filter(item => typeof(item) === 'string' && item.length !== 0)[0] || '';
}

export const format = commaNumber.bindWith(',', '.');

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
