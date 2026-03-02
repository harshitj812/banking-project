import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>Customers</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.name}</td><td>{c.email}</td><td>{c.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;