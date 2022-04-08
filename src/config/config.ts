import axios from 'axios';

const axiosInstance = (options: any = {}) => {
  const { headers = {}, baseUrl = '' } = options;
  return axios.create({
    baseURL: `${baseUrl}`,
    timeout: Number(process.env.REACT_APP_TIMEOUT),
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-CMC_PRO_API_KEY': `${process.env.REACT_APP_COINMARKETCAP_API_KEY}`,
      ...headers
    }
  });
};
export default axiosInstance;
