import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../config/config';
import { Filter } from '../interfaces/SFormData';
import { qsStringify } from './query-string';

const options = {
  baseUrl: process.env.REACT_APP_BACKEND
};

export const getProposalList = createAsyncThunk('proposal/get-all', async (body: Filter) => {
  const res = await axiosInstance(options).get(`/proposal${qsStringify(body)}`);
  return res.data;
});

export const getTransactionHistory = createAsyncThunk('/staking/history', async (body: Filter) => {
  const res = await axiosInstance(options).get(`/staking/history`, {
    params: body
  });
  return res.data;
});

export const getProposalDetail = async (id: number) => {
  const res = await axiosInstance(options).get(`/proposal/${id}`);
  return res.data;
};

export const getTVLData = async (body: Filter) => {
  const res = await axiosInstance(options).get(`/staking/tvl${qsStringify(body)}`);
  return res.data.data;
};

export const getRank = async (id: string) => {
  const res = await axiosInstance(options).get(`/voter/rank/${id}`);
  return res.data;
};
