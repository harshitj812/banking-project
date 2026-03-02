import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (username && password) {
      // dummy validation: accept any
      onLogin({ username });
    } else {
      setError('Enter username and password');
    }
  };

  return (
    <div className="col-md-4 offset-md-4">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
      {error && <div className="mt-2 text-danger">{error}</div>}
    </div>
  );
}

export default Login;