import React, { useState, useEffect } from 'react';

function App() {
  const [tickets, setTickets] = useState([]);
  
  // 1. New State for the form inputs
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchTickets = () => {
    fetch('http://127.0.0.1:8000/tickets')
      .then(response => response.json())
      .then(data => setTickets(data));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const moveTicket = (ticketId, newStatus) => {
    fetch(`http://127.0.0.1:8000/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    .then(response => response.json())
    .then(data => {
      fetchTickets();
    })
    .catch(error => console.error("Error updating ticket:", error));
  };

  // 2. The function to create a new ticket
  const createTicket = (e) => {
    e.preventDefault(); // Stops the browser from reloading the page

    // Don't submit if fields are empty
    if (!newTitle || !newDescription) {
      alert("Please fill out both fields!");
      return;
    }

    fetch('http://127.0.0.1:8000/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Notice we only send title and description. 
      // The database schema defaults the status to "To-Do".
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    })
    .then(response => response.json())
    .then(data => {
      // Clear the input boxes
      setNewTitle("");
      setNewDescription("");
      // Refresh the board to show the new ticket
      fetchTickets(); 
    })
    .catch(error => console.error("Error creating ticket:", error));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>BugTrackr</h1>
      
      {/* 3. The Create Ticket Form */}
      <form onSubmit={createTicket} style={{ marginBottom: '20px', padding: '15px', border: '2px solid black', backgroundColor: '#fffbe6', width: '300px' }}>
        <h3>Create New Ticket</h3>
        <input 
          type="text" 
          placeholder="Bug title..." 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)} 
          style={{ display: 'block', width: '90%', marginBottom: '10px', padding: '5px' }} 
        />
        <textarea 
          placeholder="Description..." 
          value={newDescription} 
          onChange={(e) => setNewDescription(e.target.value)} 
          style={{ display: 'block', width: '90%', marginBottom: '10px', padding: '5px', height: '60px' }} 
        />
        <button type="submit" style={{ padding: '5px 10px', cursor: 'pointer' }}>
          Add Ticket
        </button>
      </form>

      {/* The Kanban Board */}
      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* Column 1: To-Do */}
        <div style={{ border: '2px solid black', padding: '10px', width: '300px', backgroundColor: '#f9f9f9' }}>
          <h2>To-Do</h2>
          {tickets.filter(ticket => ticket.status === "To-Do").map(ticket => (
            <div key={ticket.id} style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', marginBottom: '10px' }}>
              <strong>{ticket.title}</strong>
              <p>{ticket.description}</p>
              <button onClick={() => moveTicket(ticket.id, "In Progress")}>
                Start Work ➡️
              </button>
            </div>
          ))}
        </div>

        {/* Column 2: In Progress */}
        <div style={{ border: '2px solid black', padding: '10px', width: '300px', backgroundColor: '#e6f7ff' }}>
          <h2>In Progress</h2>
          {tickets.filter(ticket => ticket.status === "In Progress").map(ticket => (
            <div key={ticket.id} style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', marginBottom: '10px' }}>
              <strong>{ticket.title}</strong>
              <p>{ticket.description}</p>
              <button onClick={() => moveTicket(ticket.id, "Done")}>
                Complete ✅
              </button>
            </div>
          ))}
        </div>

        {/* Column 3: Done */}
        <div style={{ border: '2px solid black', padding: '10px', width: '300px', backgroundColor: '#f6ffed' }}>
          <h2>Done</h2>
          {tickets.filter(ticket => ticket.status === "Done").map(ticket => (
            <div key={ticket.id} style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', marginBottom: '10px' }}>
              <strong>{ticket.title}</strong>
              <p>{ticket.description}</p>
              <span style={{ color: 'green', fontWeight: 'bold' }}>Finished!</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;