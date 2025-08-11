export default function GoalForm({ newGoal, setNewGoal, addGoal }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Add New Goal</h2>
      <input
        placeholder="Name"
        value={newGoal.name}
        onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Target Amount"
        value={newGoal.targetAmount}
        onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
      />
      <input
        placeholder="Category"
        value={newGoal.category}
        onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
      />
      <input
        type="date"
        value={newGoal.deadline}
        onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
      />
      <button onClick={addGoal}>Add Goal</button>
    </section>
  );
}
