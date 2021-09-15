import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getUniqueItems } from '../utils/common';
import { getItemsByType, sortValues } from '../utils/statistics';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { formatDate } from '../utils/trip';
dayjs.extend(duration);

const BAR_HEIGHT = 55;

const renderMoneyChart = (ctx, items, types) => {
  const money = types.map((type) => getItemsByType(type, items).reduce((price, item) => price + item.basePrice, 0));

  const { typesFiltered, valuesFiltered: moneyFiltered } = sortValues(types, money);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typesFiltered.map((type) => type.toUpperCase()),
      datasets: [{
        data: moneyFiltered,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (ctx, items, types) => {
  const numbers = types.map((type) => getItemsByType(type, items).length);

  const { typesFiltered, valuesFiltered: numbersFiltered } = sortValues(types, numbers);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typesFiltered.map((type) => type.toUpperCase()),
      datasets: [{
        data: numbersFiltered,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const formatTime = (durationInMinutes) => {
  const durationInDays = Math.floor(durationInMinutes / 60 / 24);
  const durationInHours = Math.floor(durationInMinutes / 60);
  const formattedTime = formatDate(durationInDays, durationInHours, durationInMinutes);
  return formattedTime;
};

const renderTimeSpendChart = (ctx, items, types) => {
  const time = types.map((type) => getItemsByType(type, items).reduce((result, { dateFrom, dateTo }) => result + dayjs(dateTo).diff(dayjs(dateFrom), 'm'), 0));

  const { typesFiltered, valuesFiltered: timeFiltered } = sortValues(types, time);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typesFiltered.map((type) => type.toUpperCase()),
      datasets: [{
        data: timeFiltered,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => formatTime(val),
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistics extends SmartView {
  constructor(tripItems) {
    super();
    this._items = tripItems;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    const itemTypes = this._items.map(({ type }) => type);
    this._uniqueTypes = getUniqueItems(itemTypes);

    const context = new Map();
    context.set('money', this.getElement().querySelector('#money'));
    context.set('type', this.getElement().querySelector('#type'));
    context.set('time-spend', this.getElement().querySelector('#time-spend'));

    context.forEach((ctx) => ctx.height = BAR_HEIGHT * this._uniqueTypes.length);

    this._moneyChart = renderMoneyChart(context.get('money'), this._items, this._uniqueTypes);
    this._typeChart = renderTypeChart(context.get('type'), this._items, this._uniqueTypes);
    this._timeSpendChart = renderTimeSpendChart(context.get('time-spend'), this._items, this._uniqueTypes);
  }
}
