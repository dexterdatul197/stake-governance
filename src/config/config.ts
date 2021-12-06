import axios from "axios";

const axiosCoinBaseInstance = (options: any = {}) => {
    const {headers = {}, baseUrl = ''} = options;
    return axios.create({
        baseURL: `${baseUrl}`,
        timeout: Number(process.env.REACT_APP_TIMEOUT),
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...headers
        },
      });
};
export default axiosCoinBaseInstance;
