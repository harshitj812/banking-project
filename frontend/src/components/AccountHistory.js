import React, { useState } from 'react';
import axios from 'axios';

function AccountHistory() {
  const [accountId, setAccountId] = useState('');
  const [history, setHistory] = useState([]);

  const fetchHistory = () => {
    axios.get(`http://localhost:8082/api/transactions/account/${accountId}`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h3>Account History</h3>
      <div className="mb-3">
        <label className="form-label">Account ID</label>
        <input className="form-control" value={accountId} onChange={e => setAccountId(e.target.value)} />
      </div>
      <button className="btn btn-secondary mb-3" onClick={fetchHistory}>Load</button>
      {history.length > 0 && (
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Type</th><th>Amount</th><th>From</th><th>To</th><th>Time</th></tr>
          </thead>
          <tbody>
            {history.map(tx => (
              <tr key={tx.id}>
                <td>{tx.id}</td><td>{tx.type}</td><td>{tx.amount}</td><td>{tx.fromAccountId}</td><td>{tx.toAccountId}</td><td>{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AccountHistory;