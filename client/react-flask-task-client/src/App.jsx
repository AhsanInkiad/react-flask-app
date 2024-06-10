import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [data, setData] = useState([]);
  const [selectedTradeCode, setSelectedTradeCode] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const uniqueTradeCodes = [...new Set(data.map(item => item.trade_code))];

  const filteredData = selectedTradeCode
    ? data.filter(item => item.trade_code === selectedTradeCode)
    : data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Stock Market Data</h1>
      <div className="mb-4">
        <label htmlFor="tradeCode" className="mr-2">Filter by Trade Code:</label>
        <select
          id="tradeCode"
          className="select select-bordered"
          value={selectedTradeCode}
          onChange={(e) => setSelectedTradeCode(e.target.value)}
        >
          <option value="">All</option>
          {uniqueTradeCodes.map((code, index) => (
            <option key={index} value={code}>{code}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Trade Code</th>
              <th>Date</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.trade_code}</td>
                <td>{item.date}</td>
                <td>{item.open}</td>
                <td>{item.high}</td>
                <td>{item.low}</td>
                <td>{item.close}</td>
                <td>{item.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
