import React, { useEffect, useState } from 'react';

export default function GoalDashboard() {
  const [goals, setGoals] = useState([]);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    category: '',
    deadline: '',
  });

  // Editing state
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editedGoal, setEditedGoal] = useState({
    name: '',
    targetAmount: '',
    category: '',
    deadline: '',
  });

  // Deposit state
  const [deposit, setDeposit] = useState({
    goalId: '',
    amount: '',
  });

  // Fetch goals on mount
  useEffect(() => {
    fetch('http://localhost:3001/goals')
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error('Failed to fetch goals:', err));
  }, []);

  // New goal input handler
  function handleChange(e) {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  }

  // Submit new goal
  function handleSubmit(e) {
    e.preventDefault();

    const goalToAdd = {
      ...newGoal,
      id: Date.now().toString(),
      savedAmount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      targetAmount: Number(newGoal.targetAmount),
    };

    fetch('http://localhost:3001/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalToAdd),
    })
      .then(res => res.json())
      .then(addedGoal => {
        setGoals(prev => [...prev, addedGoal]);
        setNewGoal({ name: '', targetAmount: '', category: '', deadline: '' });
      })
      .catch(err => console.error('Failed to add goal:', err));
  }

  // Start editing
  function startEditing(goal) {
    setEditingGoalId(goal.id);
    setEditedGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      category: goal.category,
      deadline: goal.deadline,
    });
  }

  // Edit input handler
  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditedGoal(prev => ({ ...prev, [name]: value }));
  }

  // Submit edited goal
  function submitEdit(e, id) {
    e.preventDefault();

    fetch(`http://localhost:3001/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editedGoal,
        targetAmount: Number(editedGoal.targetAmount),
      }),
    })
      .then(res => res.json())
      .then(updatedGoal => {
        setGoals(prev => prev.map(goal => (goal.id === id ? updatedGoal : goal)));
        setEditingGoalId(null);
      })
      .catch(err => console.error('Failed to update goal:', err));
  }

  // Delete a goal
  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this goal?")) {
      fetch(`http://localhost:3001/goals/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setGoals(prev => prev.filter(goal => goal.id !== id));
        })
        .catch(err => console.error('Failed to delete goal:', err));
    }
  }

  // Deposit input change
  function handleDepositChange(e) {
    const { name, value } = e.target;
    setDeposit(prev => ({ ...prev, [name]: value }));
  }

  // Submit deposit
  function handleDepositSubmit(e) {
    e.preventDefault();

    const selectedGoal = goals.find(goal => goal.id === deposit.goalId);
    if (!selectedGoal) return alert("Invalid goal selected.");

    const updatedAmount = Number(selectedGoal.savedAmount) + Number(deposit.amount);

    fetch(`http://localhost:3001/goals/${deposit.goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAmount: updatedAmount }),
    })
      .then(res => res.json())
      .then(updatedGoal => {
        setGoals(prev =>
          prev.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal))
        );
        setDeposit({ goalId: '', amount: '' }); // Reset form
      })
      .catch(err => console.error("Failed to update deposit:", err));
  }

  return (
    <div>
      <h1>My Savings Goals</h1>
      {goals.length === 0 ? (
        <p>No goals found.</p>
      ) : (
        <ul>
          {goals.map(goal => (
            <li key={goal.id}>
              {editingGoalId === goal.id ? (
                <form onSubmit={(e) => submitEdit(e, goal.id)}>
                  <input
                    type="text"
                    name="name"
                    value={editedGoal.name}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="number"
                    name="targetAmount"
                    value={editedGoal.targetAmount}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="text"
                    name="category"
                    value={editedGoal.category}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="date"
                    name="deadline"
                    value={editedGoal.deadline}
                    onChange={handleEditChange}
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingGoalId(null)}>Cancel</button>
                </form>
              ) : (
                <div>
                  <strong>{goal.name}</strong> — Saved: ${goal.savedAmount} / Target: ${goal.targetAmount}
                  <br />
                  Category: {goal.category} | Deadline: {goal.deadline}
                  <br />
                  <button onClick={() => startEditing(goal)}>Edit</button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    style={{ color: 'red', marginLeft: '10px' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>Add New Goal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Goal Name"
          value={newGoal.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="targetAmount"
          placeholder="Target Amount"
          value={newGoal.targetAmount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newGoal.category}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="deadline"
          value={newGoal.deadline}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Goal</button>
      </form>

      <h2>Make a Deposit</h2>
      <form onSubmit={handleDepositSubmit}>
        <select name="goalId" value={deposit.goalId} onChange={handleDepositChange} required>
          <option value="">Select a goal</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Deposit amount"
          value={deposit.amount}
          onChange={handleDepositChange}
          required
        />
        <button type="submit">Add Deposit</button>
      </form>
    </div>
  );
}
