import { useState, useEffect } from 'react';
import GoalList from './components/GoalList';
import GoalForm from './components/GoalForm';
import DepositForm from './components/DepositForm';

function App() {
  const [goals, setGoals] = useState([]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    category: '',
    deadline: '',
  });

  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editedGoal, setEditedGoal] = useState({
    name: '',
    targetAmount: '',
    category: '',
    deadline: '',
  });

  const [deposit, setDeposit] = useState({
    goalId: '',
    amount: '',
  });

  useEffect(() => {
    fetch('http://localhost:3001/goals')
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const addGoal = () => {
    const { name, targetAmount, category, deadline } = newGoal;

    if (!name || !targetAmount || !category || !deadline) {
      alert('Please fill all fields');
      return;
    }

    const goalToAdd = {
      ...newGoal,
      targetAmount: Number(targetAmount),
      savedAmount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    fetch('http://localhost:3001/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalToAdd),
    })
      .then(res => res.json())
      .then(data => {
        setGoals(prev => [...prev, data]);
        setNewGoal({ name: '', targetAmount: '', category: '', deadline: '' });
      })
      .catch(err => console.error('Add error:', err));
  };

  const deleteGoal = (id) => {
    fetch(`http://localhost:3001/goals/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setGoals(prev => prev.filter(goal => goal.id !== id));
      })
      .catch(err => console.error('Delete error:', err));
  };

  const startEditing = (goal) => {
    setEditingGoalId(goal.id);
    setEditedGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      category: goal.category,
      deadline: goal.deadline,
    });
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
    setEditedGoal({ name: '', targetAmount: '', category: '', deadline: '' });
  };

  const saveEdit = () => {
    const { name, targetAmount, category, deadline } = editedGoal;

    if (!name || !targetAmount || !category || !deadline) {
      alert('Please fill all fields');
      return;
    }

    fetch(`http://localhost:3001/goals/${editingGoalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        targetAmount: Number(targetAmount),
        category,
        deadline,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setGoals(prev => prev.map(goal => goal.id === editingGoalId ? data : goal));
        cancelEdit();
      })
      .catch(err => console.error('Edit error:', err));
  };

  const makeDeposit = () => {
    if (!deposit.goalId || !deposit.amount) {
      alert('Select a goal and enter amount');
      return;
    }

    const goal = goals.find(g => g.id === deposit.goalId);
    if (!goal) return;

    const newSavedAmount = goal.savedAmount + Number(deposit.amount);

    fetch(`http://localhost:3001/goals/${deposit.goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAmount: newSavedAmount }),
    })
      .then(res => res.json())
      .then(data => {
        setGoals(prev => prev.map(g => g.id === deposit.goalId ? data : g));
        setDeposit({ goalId: '', amount: '' });
      })
      .catch(err => console.error('Deposit error:', err));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '700px', margin: 'auto' }}>
      <h1>My Savings Goals</h1>

      <GoalForm
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        addGoal={addGoal}
      />

      <DepositForm
        deposit={deposit}
        setDeposit={setDeposit}
        makeDeposit={makeDeposit}
        goals={goals}
      />

      <GoalList
        goals={goals}
        editingGoalId={editingGoalId}
        editedGoal={editedGoal}
        setEditedGoal={setEditedGoal}
        startEditing={startEditing}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        deleteGoal={deleteGoal}
      />
    </div>
  );
}

export default App;
