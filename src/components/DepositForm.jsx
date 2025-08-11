export default function DepositForm({ deposit, setDeposit, makeDeposit, goals }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Make a Deposit</h2>
      <select
        value={deposit.goalId}
        onChange={e => setDeposit(prev => ({ ...prev, goalId: e.target.value }))}
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
        value={deposit.amount}
        onChange={e => setDeposit(prev => ({ ...prev, amount: e.target.value }))}
      />
      <button onClick={makeDeposit}>Deposit</button>
    </section>
  );
}
