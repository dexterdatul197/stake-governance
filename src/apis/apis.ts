import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../config/config';
import { Filter } from '../interfaces/SFormData';
import { qsStringify } from './query-string';

export const getProposalList = createAsyncThunk(
  'governance/proposal/get-all',
  async (body: Filter) => {
    const options = {
      baseUrl: process.env.REACT_APP_BACKEND,
    };
    const res = await axiosInstance(options).get(`/governance/proposal${qsStringify(body)}`);
    return res.data;
  }
);
