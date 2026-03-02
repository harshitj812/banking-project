import React, { useState } from 'react';
import axios from 'axios';

function TransactionForm() {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [type, setType] = useState('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const payload = { type, amount: parseFloat(amount) };
    if (type === 'DEPOSIT') payload.toAccountId = parseInt(toId, 10);
    else if (type === 'WITHDRAWAL') payload.fromAccountId = parseInt(fromId, 10);
    else if (type === 'TRANSFER') {
      payload.fromAccountId = parseInt(fromId, 10);
      payload.toAccountId = parseInt(toId, 10);
    }
    axios.post('http://localhost:8082/api/transactions', payload)
      .then(res => {
        setMessage('Transaction success');
      })
      .catch(err => {
        setMessage('Error: ' + err.response?.data?.message || err.message);
      });
  };

  return (
    <div>
      <h3>New Transaction</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>
        {type === 'DEPOSIT' && (
          <div className="mb-3">
            <label className="form-label">To Account ID</label>
            <input className="form-control" value={toId} onChange={e => setToId(e.target.value)} required />
          </div>
        )}
        {type === 'WITHDRAWAL' && (
          <div className="mb-3">
            <label className="form-label">From Account ID</label>
            <input className="form-control" value={fromId} onChange={e => setFromId(e.target.value)} required />
          </div>
        )}
        {type === 'TRANSFER' && (
          <>
            <div className="mb-3">
              <label className="form-label">From Account ID</label>
              <input className="form-control" value={fromId} onChange={e => setFromId(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">To Account ID</label>
              <input className="form-control" value={toId} onChange={e => setToId(e.target.value)} required />
            </div>
          </>
        )}
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input type="number" step="0.01" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
}

export default TransactionForm;