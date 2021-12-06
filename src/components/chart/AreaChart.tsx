import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AreaChart.module.scss';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axiosCoinBaseInstance from '../../config/config';
import { CoinGeckoClient } from 'coingecko-api-v3';

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const cx = classNames.bind(styles);
const defaultSeries = [{ data: [1, 2, 3], name: 'Price' }];

const AreaChart: React.FC = () => {
  const [series, setSeries] = useState(defaultSeries);
  const [option, setOption] = useState<ApexOptions>({
    chart: {
      height: 280,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ['#2E93fA', '#F3950D'],
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    grid: {
      show: false,
    },
    xaxis: {
      labels: {
        show: false,
      },
      categories: ['1', '2', '3'],
    },
    yaxis: {
      show: false,
    },
  });

  const convertToDate = (param: number) => {
    return `${new Date(param).getFullYear()} - ${
      new Date(param).getMonth() + 1
    } - ${new Date(param).getDate()}`;
  };

  const chainPriceDataForChart = (data: any) => {
    const res = data.reduce((res: any[], e: any) => {
      const date = convertToDate(e[0]);
      const existDate = res.filter(
        (item: any) => convertToDate(item[0]) === date
      );
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

    const categories: any = res.map((item: number[]) => convertToDate(item[0]));
    const seriesPrice = res.map((item: number[]) => item[2]);

    const series = [{
      name: 'Price',
      data: seriesPrice
    }];

    setOption({
      ...option,
      xaxis: {
        categories: categories
      }
    });
    setSeries(series);
  };

  const getCoinGecko = async() => {
    const aa = await coinGeckoClient.coinIdOHLC({
      id: "chain",
      vs_currency: "usd",
      days: 30
    })
    chainPriceDataForChart(aa)
  }

  useEffect(() => {
    getCoinGecko();
  },[]);

  return (
    <div className={cx('area-chart')}>
      <div id="chart" style={{ height: 500 }}>
        <ReactApexChart
          options={option}
          series={series}
          width="100%"
          type="line"
          height="100%"
        />
      </div>
    </div>
  );
};
export default AreaChart;
