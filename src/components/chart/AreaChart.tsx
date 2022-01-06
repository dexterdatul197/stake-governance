import { ApexOptions } from 'apexcharts';
import classNames from 'classnames/bind';
import { CoinGeckoClient } from 'coingecko-api-v3';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from './AreaChart.module.scss';
import { useAppSelector } from '../../store/hooks';
import { CircularProgress } from '@material-ui/core';
import { getTVLData } from '../../apis/apis';
import { dateBeforeMonth } from '../../helpers/common';

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const cx = classNames.bind(styles);

const AreaChart: React.FC = () => {
  const [series, setSeries] = useState([{ data: [], name: "Price" }]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedCurrency = useAppSelector(
    (state) => state.currency.selectedCurrency
  );

  const [option, setOption] = useState<ApexOptions>({
    chart: {
      type: 'line',
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
    colors: ['#F78939', '#107DEF'],
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
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
      categories: ["1", "2", "3"],
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      shared: true
    },
    series: [
      {
        name: 'Price',
        data: [1, 2, 3]
      },
      {
        name: 'TVL',
        data: [2, 5, 6]
      }
    ]
  });

  const convertToDate = (param: number) => {
    return `${new Date(param).getFullYear()} - ${
      new Date(param).getMonth() + 1
    } - ${new Date(param).getDate()}`;
  };

  const chainPriceDataForChart = (data: any, tvlData: any) => {
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
    const tvlFinally = tvlData.map((item: { data: number, time: number }) => item.data);

    const series = [
      {
        name: "Price",
        data: seriesPrice,
      },
      {
        name: 'TVL',
        data: tvlFinally.reverse(),
      },
    ];

    setOption({
      ...option,
      xaxis: {
        categories: categories,
        labels: {
          show: false
        }
      },
      tooltip: {
        shared: true
      }
      // tooltip: {
      //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      //     return (
      //       '<div style="padding: 10px; text-transform: uppercase">' +
      //       `$${series[seriesIndex][dataPointIndex]} <strong>${selectedCurrency}</strong>` +
      //       '</div>'
      //     );
      //   },
      // },
    });
    setSeries(series);
  };

  const getCoinGecko = async () => {
    const getOHCL = await coinGeckoClient.coinIdOHLC({
      id: "chain",
      vs_currency: `${selectedCurrency}`,
      days: 30,
    });
    const param = {
      startTime: dateBeforeMonth(new Date(), 1).getTime(),
      endTime: new Date().getTime()
    }
    const tvlData = await getTVLData(param);
    console.log('CHART TVL DATA: ', tvlData);
    
    chainPriceDataForChart(getOHCL, tvlData.data);
    if (getOHCL) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCoinGecko();
  }, [selectedCurrency]);

  return (
    <div className={cx("area-chart")}>
      <div id="chart" style={{ height: 480 }}>
        {isLoading ? (
          <CircularProgress
            size={50}
            color="primary"
            sx={{
              position: "absolute",
              top: "50%",
            }}
          />
        ) : (
          <ReactApexChart
            options={option}
            series={series}
            width="100%"
            type="line"
            height="100%"
          />
        )}
      </div>
    </div>
  );
};
export default AreaChart;
