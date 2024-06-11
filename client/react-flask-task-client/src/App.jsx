import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, BarController, BarElement, PointElement, LineController, LineElement, Title, Tooltip, Legend } from 'chart.js';

import { Chart} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Adapter for date formatting

import './App.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarController,
  BarElement,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function App() {
  const [data, setData] = useState([]);
  const [allTradeCodes, setAllTradeCodes] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [newRow, setNewRow] = useState({
    date: '',
    trade_code: '',
    high: '',
    low: '',
    open: '',
    close: '',
    volume: ''
  });
  const [selectedTradeCode, setSelectedTradeCode] = useState('');
  const [atr, setAtr] = useState(null);
  const [standardDeviation, setStandardDeviation] = useState(null);
  const [maxDrawdown, setMaxDrawdown] = useState(null);
  const [dailyRangePercentage, setDailyRangePercentage] = useState(null);

  // FETCHING DATA
  useEffect(() => {
    fetchAllTradeCodes();
  }, []);

  useEffect(() => {
    if (selectedTradeCode) {
      fetchData(selectedTradeCode);
    } else {
      setData([]);
    }
  }, [selectedTradeCode]);

  const fetchAllTradeCodes = async () => {
    try {
      const response = await axios.get('https://react-flask-app-vqc6.onrender.com/api/trade_data');
      const uniqueTradeCodes = [...new Set(response.data.map(item => item.trade_code))];
      setAllTradeCodes(uniqueTradeCodes);
    } catch (error) {
      console.error('Error fetching trade codes:', error);
    }
  };

  const fetchData = async (tradeCode) => {
    try {
      const response = await axios.get(`https://react-flask-app-vqc6.onrender.com/api/trade_data?trade_code=${tradeCode}`);
      const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(sortedData);
      calculateMetrics(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // CALCULATIONS
  const calculateMetrics = (data) => {
    if (!data || data.length === 0) return;

    // Calculate ATR
    const atrPeriods = 14; // Typical period for ATR
    let trueRanges = [];
    for (let i = 1; i < data.length; i++) {
      const highLow = data[i].high - data[i].low;
      const highClose = Math.abs(data[i].high - data[i - 1].close);
      const lowClose = Math.abs(data[i].low - data[i - 1].close);
      trueRanges.push(Math.max(highLow, highClose, lowClose));
    }
    const atrValue = trueRanges.slice(-atrPeriods).reduce((a, b) => a + b, 0) / atrPeriods;

    // Calculate Standard Deviation
    const mean = data.reduce((a, b) => a + b.close, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b.close - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    // Calculate Maximum Drawdown
    let peak = data[0].close;
    let maxDD = 0;
    data.forEach((item) => {
      if (item.close > peak) peak = item.close;
      const drawdown = (peak - item.close) / peak;
      if (drawdown > maxDD) maxDD = drawdown;
    });

    // Calculate Daily Range Percentage
    const dailyRangePercentages = data.map(item => ((item.high - item.low) / item.close) * 100);
    const avgDailyRangePercentage = dailyRangePercentages.reduce((a, b) => a + b, 0) / dailyRangePercentages.length;

    setAtr(atrValue);
    setStandardDeviation(stdDev);
    setMaxDrawdown(maxDD);
    setDailyRangePercentage(avgDailyRangePercentage);
  };

  // NECESSARY FUNCTIONS
  const handleEdit = (index) => {
    setEditingRow(index);
  };

  const handleSave = async (index) => {
    const updatedRow = data[index];
    try {
      await axios.put(`http://127.0.0.1:5000/api/trade_data/${updatedRow.id}`, updatedRow);
      setEditingRow(null);
      fetchData(selectedTradeCode);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/trade_data/${id}`);
      fetchData(selectedTradeCode);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/trade_data', newRow);
      setNewRow({ date: '', trade_code: '', high: '', low: '', open: '', close: '', volume: '' });
      fetchData(selectedTradeCode);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedData = [...data];
    updatedData[index][name] = value;
    setData(updatedData);
  };

  const handleNewRowChange = (event) => {
    const { name, value } = event.target;
    setNewRow((prevRow) => ({
      ...prevRow,
      [name]: value
    }));
  };

  const handleTradeCodeChange = (event) => {
    setSelectedTradeCode(event.target.value);
  };

  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  // DATA VISUALIZATION
  const chartData = {
    labels: sortedData.map(item => item.date),
    datasets: [
      {
        type: 'line',
        label: 'Close',
        data: sortedData.map(item => item.close),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Volume',
        data: sortedData.map(item => item.volume),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgb(153, 102, 255)',
        yAxisID: 'y2',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const volatilityData = {
    labels: sortedData.map(item => item.date),
    datasets: [
      {
        label: 'High',
        data: sortedData.map(item => item.high),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'Low',
        data: sortedData.map(item => item.low),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
    ],
  };

  const volatilityOptions = {
    responsive: true,
    scales: {
      x: {
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="container mx-auto p-4 bg-white text-black font-semibold">
      <h1 className="mt-12 text-3xl text-center font-bold">Stock Market Data</h1>
      <div className='flex justify-center mt-16 mb-12'>
        <div className="mb-4">
          <label className="text-lg font-medium mb-2 mr-2">Select Trade Code:</label>
          <select className="text-black bg-white border-2 border-green-200 select w-2/10" value={selectedTradeCode} onChange={handleTradeCodeChange}>
            <option value="">-- Select Trade Code --</option>
            {allTradeCodes.map((tradeCode, index) => (
              <option key={index} value={tradeCode}>{tradeCode}</option>
            ))}
          </select>
        </div>
      </div>


      <>
        {/*STOCK PERFORMANCE CHART */}
        <div className="mb-20 py-8 rounded-lg shadow-lg flex border justify-center">
          <div className='w-3/4'>
            <p className='text-center mb-8'>Stock Performance Chart:</p>
            <Chart type="bar" data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* VOLATILITY CHART */}
        <div className="mb-4 py-8 px-8 rounded-lg shadow-lg border grid grid-flow-row lg:grid-flow-col gap-8">
          <div className='w-3/4 lg:w-auto'>
            <p className='text-center mb-8'>Volatility Chart:</p>
            <Chart type="line" data={volatilityData} options={volatilityOptions} />
          </div>

          <div className='ml-0 lg:ml-4 grid gap-8'>
            <div className="card w-full bg-green-100 p-4 rounded-lg shadow-lg">
              <h2 className="lg:text-xl font-bold">Average True Range</h2>
              <p className={atr ? '' : 'text-sm text-red-500'}>{atr ? atr.toFixed(2) : '(select a trade code)'}</p>
            </div>
            <div className="card w-full bg-blue-100 p-4 rounded-lg shadow-lg">
              <h2 className="lg:text-xl font-bold">Standard Deviation</h2>
              <p className={standardDeviation ? '' : 'text-sm text-red-500'}>{standardDeviation ? standardDeviation.toFixed(2) : '(select a trade code)'}</p>
            </div>
            <div className="card w-full bg-yellow-100 p-4 rounded-lg shadow-lg">
              <h2 className="lg:text-xl font-bold">Maximum Drawdown</h2>
              <p className={maxDrawdown ? '' : 'text-sm text-red-500'}>{maxDrawdown ? (maxDrawdown * 100).toFixed(2) + '%' : '(select a trade code)'}</p>
            </div>
            <div className="card w-full bg-red-100 p-4 rounded-lg shadow-lg">
              <h2 className="lg:text-xl font-bold">Daily Range %</h2>
              <p className={dailyRangePercentage ? '' : 'text-sm text-red-500'}>{dailyRangePercentage ? dailyRangePercentage.toFixed(2) + '%' : '(select a trade code)'}</p>
            </div>
          </div>
        </div>



        <div className=" my-20 flex">
          {/* TABLE */}
          <div className='overflow-x-auto border rounded-lg p-4 shadow-xl mt-10 '>
            <table className="table ">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trade Code</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Open</th>
                  <th>Close</th>
                  <th>Volume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {editingRow === index ? (
                      <>
                        <td className='text-white'><input type="text" name="date" value={item.date} onChange={(e) => handleChange(index, e)} className="input input-bordered w-full" /></td>
                        <td className='text-white'><input type="text" name="trade_code" value={item.trade_code} onChange={(e) => handleChange(index, e)} className="input input-bordered w-full" /></td>
                        <td className='text-white'><input type="number" name="high" value={item.high} onChange={(e) => handleChange(index, e)} className="input input-bordered w-full" /></td>
                        <td className='text-white'><input type="number" name="low" value={item.low} onChange={(e) => handleChange(index, e)} className="input input-bordered w-full" /></td>
                        <td className='text-white'><input type="number" name="open" value={item.open} onChange={(e) => handleChange(index, e)} className="input input-bordered w-full" /></td>
                        <td className='text-white'><input type="number" name="close" value={item.close} onChange={(e) => handleChange(index, e)} className="input input-bordered w-full" /></td>
                        <td className='text-white'><input type="number" name="volume" value={item.volume} onChange={(e) => handleChange(index, e)} className="input input-bordered w-full" /></td>
                        <td>
                          <button onClick={() => handleSave(index)} className="btn btn-sm btn-outline btn-info">Save</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.date}</td>
                        <td>{item.trade_code}</td>
                        <td>{item.high}</td>
                        <td>{item.low}</td>
                        <td>{item.open}</td>
                        <td>{item.close}</td>
                        <td>{item.volume}</td>
                        <td>
                          <div className='flex gap-2'>
                            <button onClick={() => handleEdit(index)} className="btn btn-sm btn-outline btn-success">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline btn-error">Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                <tr>
                  <td><input type="text" name="date" value={newRow.date} onChange={handleNewRowChange} className="input border-black input-bordered w-full text-black bg-white" /></td>
                  <td><input type="text" name="trade_code" value={newRow.trade_code} onChange={handleNewRowChange} className="input border-black input-bordered w-full text-black bg-white" /></td>
                  <td><input type="number" name="high" value={newRow.high} onChange={handleNewRowChange} className="input border-black input-bordered w-full text-black bg-white" /></td>
                  <td><input type="number" name="low" value={newRow.low} onChange={handleNewRowChange} className="input border-black input-bordered w-full text-black bg-white" /></td>
                  <td><input type="number" name="open" value={newRow.open} onChange={handleNewRowChange} className="input border-black input-bordered w-full text-black bg-white" /></td>
                  <td><input type="number" name="close" value={newRow.close} onChange={handleNewRowChange} className="input border-black input-bordered w-full text-black bg-white" /></td>
                  <td><input type="number" name="volume" value={newRow.volume} onChange={handleNewRowChange} className="input border-black input-bordered w-full text-black bg-white" /></td>
                  <td><button onClick={handleAdd} className="btn btn-outline btn-info">Add</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>

    </div>
  );
}

export default App;
