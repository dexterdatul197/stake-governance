import { ApexOptions } from 'apexcharts';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { convertToDate } from '../../helpers/common';
import { TVLDataRes } from '../../interfaces/SFormData';
import styles from './AreaChart.module.scss';
interface Props {
  tvlData?: TVLDataRes[];
  ohclData?: any[];
}

const cx = classNames.bind(styles);
const AreaChart: React.FC<Props> = (props) => {
  const [series, setSeries] = useState([{ data: [], name: 'Price' }]);
  const [option, setOption] = useState<ApexOptions>({
    chart: {
      type: 'line',
      height: 280,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    colors: ['#F78939', '#107DEF'],
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0
    },
    grid: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      },
      categories: ['1', '2', '3']
    },
    yaxis: {
      show: false
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

  const chainPriceDataForChart = (data: any, tvlData: any) => {
    const tvlDataArr = tvlData.map((item: any) => item.tvl);
    const categories = tvlData.map((item: any) => convertToDate(item.timestamp))
    const series = [
      {
        name: 'Price',
        data: data
      },
      {
        name: 'TVL',
        data: tvlDataArr
      }
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
    });
    setSeries(series);
  };

  useEffect(() => {
    // eventBus.on(SocketEvent.tvlDataUpdate, async (data: any) => {});
    chainPriceDataForChart(props.ohclData, props.tvlData);
  }, [props.ohclData, props.tvlData]);

  return (
    <div className={cx('area-chart')}>
      <div id="chart" style={{ height: 480 }}>
        <ReactApexChart options={option} series={series} width="100%" type="line" height="100%" />
      </div>
    </div>
  );
};
export default AreaChart;
