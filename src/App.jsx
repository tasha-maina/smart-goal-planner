import { useState, useEffect } from 'react';

function App() {
  const [goals, setGoals] = useState([]);

  // States for adding new goal
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  // States for editing goal
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  // States for deposit
  const [depositGoalId, setDepositGoalId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  // Fetch goals from backend on mount
  useEffect(() => {
    fetch('http://localhost:3001/goals')
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // Add new goal
  const addGoal = () => {
    if (!newName || !newTarget || !newCategory || !newDeadline) {
      alert('Please fill all fields');
      return;
    }

    const newGoal = {
      name: newName,
      targetAmount: Number(newTarget),
      savedAmount: 0,
      category: newCategory,
      deadline: newDeadline,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    fetch('http://localhost:3001/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal),
    })
      .then(res => res.json())
      .then(data => {
        setGoals(prev => [...prev, data]);
        setNewName('');
        setNewTarget('');
        setNewCategory('');
        setNewDeadline('');
      })
      .catch(err => console.error('Add error:', err));
  };

  // Delete goal
  const deleteGoal = (id) => {
    fetch(`http://localhost:3001/goals/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setGoals(prev => prev.filter(goal => goal.id !== id));
      })
      .catch(err => console.error('Delete error:', err));
  };

  // Start editing a goal
  const startEditing = (goal) => {
    setEditingGoalId(goal.id);
    setEditName(goal.name);
    setEditTarget(goal.targetAmount);
    setEditCategory(goal.category);
    setEditDeadline(goal.deadline);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingGoalId(null);
    setEditName('');
    setEditTarget('');
    setEditCategory('');
    setEditDeadline('');
  };

  // Save edited goal
  const saveEdit = () => {
    if (!editName || !editTarget || !editCategory || !editDeadline) {
      alert('Please fill all fields');
      return;
    }

    const updatedGoal = {
      name: editName,
      targetAmount: Number(editTarget),
      category: editCategory,
      deadline: editDeadline,
    };

    fetch(`http://localhost:3001/goals/${editingGoalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGoal),
    })
      .then(res => res.json())
      .then(data => {
        setGoals(prev =>
          prev.map(goal => (goal.id === editingGoalId ? data : goal))
        );
        cancelEdit();
      })
      .catch(err => console.error('Edit error:', err));
  };

  // Make deposit
  const makeDeposit = () => {
    if (!depositGoalId || !depositAmount) {
      alert('Select a goal and enter deposit amount');
      return;
    }
    if (Number(depositAmount) <= 0) {
      alert('Deposit amount must be positive');
      return;
    }

    const goal = goals.find(g => g.id === depositGoalId);
    if (!goal) return;

    const newSavedAmount = goal.savedAmount + Number(depositAmount);

    fetch(`http://localhost:3001/goals/${depositGoalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAmount: newSavedAmount }),
    })
      .then(res => res.json())
      .then(data => {
        setGoals(prev =>
          prev.map(goal => (goal.id === depositGoalId ? data : goal))
        );
        setDepositAmount('');
        setDepositGoalId('');
      })
      .catch(err => console.error('Deposit error:', err));
  };

  // Helper: calculate progress %
  const progressPercent = (goal) =>
    Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);

  // Helper: format deadline warning / overdue per assignment
  const today = new Date();
  const daysLeft = (deadline) => {
    const d = new Date(deadline);
    const diffTime = d - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '700px', margin: 'auto' }}>
      <h1>My Savings Goals</h1>

      {/* Add New Goal */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Add New Goal</h2>
        <input
          placeholder="Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={newTarget}
          onChange={e => setNewTarget(e.target.value)}
        />
        <input
          placeholder="Category"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <input
          type="date"
          value={newDeadline}
          onChange={e => setNewDeadline(e.target.value)}
        />
        <button onClick={addGoal}>Add Goal</button>
      </section>

      {/* Deposit to Goal */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Make a Deposit</h2>
        <select
          value={depositGoalId}
          onChange={e => setDepositGoalId(e.target.value)}
        >
          <option value="">Select a goal</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={depositAmount}
          onChange={e => setDepositAmount(e.target.value)}
        />
        <button onClick={makeDeposit}>Deposit</button>
      </section>

      {/* List of Goals */}
      <section>
        <h2>All Goals</h2>
        {goals.length === 0 ? (
          <p>No goals found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {goals.map(goal => {
              const leftDays = daysLeft(goal.deadline);
              const isCompleted = goal.savedAmount >= goal.targetAmount;
              const isWarning = leftDays <= 30 && leftDays > 0 && !isCompleted;
              const isOverdue = leftDays < 0 && !isCompleted;

              return (
                <li
                  key={goal.id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: isOverdue
                      ? '#f8d7da'
                      : isWarning
                      ? '#fff3cd'
                      : 'white',
                  }}
                >
                  {editingGoalId === goal.id ? (
                    <>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                      <input
                        type="number"
                        value={editTarget}
                        onChange={e => setEditTarget(e.target.value)}
                      />
                      <input
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                      />
                      <input
                        type="date"
                        value={editDeadline}
                        onChange={e => setEditDeadline(e.target.value)}
                      />
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>{goal.name}</h3>
                      <p>
                        Saved: ${goal.savedAmount} / Target: ${goal.targetAmount}
                      </p>
                      <p>Category: {goal.category}</p>
                      <p>Deadline: {goal.deadline}</p>
                      <progress
                        value={goal.savedAmount}
                        max={goal.targetAmount}
                        style={{ width: '100%' }}
                      />
                      <p>
                        {isCompleted
                          ? 'Goal Completed 🎉'
                          : isWarning
                          ? `⚠️ Deadline in ${leftDays} days!`
                          : isOverdue
                          ? '❌ Goal overdue'
                          : ''}
                      </p>
                      <button onClick={() => startEditing(goal)}>Edit</button>
                      <button onClick={() => deleteGoal(goal.id)}>Delete</button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
