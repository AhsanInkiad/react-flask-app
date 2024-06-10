import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import './App.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

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
      const response = await axios.get('http://127.0.0.1:5000/api/trade_data');
      const uniqueTradeCodes = [...new Set(response.data.map(item => item.trade_code))];
      setAllTradeCodes(uniqueTradeCodes);
    } catch (error) {
      console.error('Error fetching trade codes:', error);
    }
  };

  const fetchData = async (tradeCode) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/trade_data?trade_code=${tradeCode}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const chartData = {
    labels: data.map(item => item.date).sort((a, b) => new Date(a) - new Date(b)),
    datasets: [
      {
        type: 'line',
        label: 'Close',
        data: data.map(item => item.close),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Volume',
        data: data.map(item => item.volume),
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

  return (
    <div className="container mx-auto p-4 bg-white text-black font-semibold">
      <h1 className="text-3xl text-center font-bold mb-4">Stock Market Data</h1>
      <div className="mb-4">
        <label className="text-lg font-medium mb-2 mr-2">Select Trade Code:</label>
        <select className="text-white  select select-bordered w-2/8" value={selectedTradeCode} onChange={handleTradeCodeChange}>
          <option value="">-- Select Trade Code --</option>
          {allTradeCodes.map((tradeCode, index) => (
            <option key={index} value={tradeCode}>{tradeCode}</option>
          ))}
        </select>
      </div>

      {selectedTradeCode && data.length > 0 && (
        <>
          <div className="mb-4">
            <Chart type="bar" data={chartData} options={chartOptions} />
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className='text-black'>Date</th>
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
                  <td className='text-white'><input type="text" name="date" value={newRow.date} onChange={handleNewRowChange} className="input input-bordered w-full" /></td>
                  <td className='text-white'><input type="text" name="trade_code" value={newRow.trade_code} onChange={handleNewRowChange} className="input input-bordered w-full" /></td>
                  <td className='text-white'><input type="number" name="high" value={newRow.high} onChange={handleNewRowChange} className="input input-bordered w-full" /></td>
                  <td className='text-white'><input type="number" name="low" value={newRow.low} onChange={handleNewRowChange} className="input input-bordered w-full" /></td>
                  <td className='text-white'><input type="number" name="open" value={newRow.open} onChange={handleNewRowChange} className="input input-bordered w-full" /></td>
                  <td className='text-white'><input type="number" name="close" value={newRow.close} onChange={handleNewRowChange} className="input input-bordered w-full" /></td>
                  <td className='text-white'><input type="number" name="volume" value={newRow.volume} onChange={handleNewRowChange} className="input input-bordered w-full" /></td>
                  <td><button onClick={handleAdd} className="btn btn-success">Add</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

