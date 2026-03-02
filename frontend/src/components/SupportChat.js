import React, { useState } from 'react';

function SupportChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (input.trim() === '') return;
    const userMsg = { text: input, sender: 'you' };
    setMessages([...messages, userMsg]);
    setInput('');
    // simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Support is not available in this demo.', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div>
      <h3>Support Chat</h3>
      <div className="border p-3 mb-3" style={{ height: '300px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} className={m.sender === 'bot' ? 'text-primary' : 'text-end'}>
            <span className="badge bg-secondary">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="input-group">
        <input value={input} onChange={e => setInput(e.target.value)} className="form-control" />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default SupportChat;