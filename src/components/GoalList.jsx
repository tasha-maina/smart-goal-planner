export default function GoalList({
  goals,
  editingGoalId,
  editedGoal,
  setEditedGoal,
  startEditing,
  cancelEdit,
  saveEdit,
  deleteGoal
}) {
  const today = new Date();
  const daysLeft = (deadline) => {
    const d = new Date(deadline);
    const diff = d - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
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
                      value={editedGoal.name}
                      onChange={e => setEditedGoal(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      type="number"
                      value={editedGoal.targetAmount}
                      onChange={e => setEditedGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    />
                    <input
                      value={editedGoal.category}
                      onChange={e => setEditedGoal(prev => ({ ...prev, category: e.target.value }))}
                    />
                    <input
                      type="date"
                      value={editedGoal.deadline}
                      onChange={e => setEditedGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h3>{goal.name}</h3>
                    <p>Saved: ${goal.savedAmount} / Target: ${goal.targetAmount}</p>
                    <p>Category: {goal.category}</p>
                    <p>Deadline: {goal.deadline}</p>
                    <progress value={goal.savedAmount} max={goal.targetAmount} style={{ width: '100%' }} />
                    <p>
                      {isCompleted
                        ? '🎉 Goal Completed'
                        : isWarning
                        ? `⚠️ ${leftDays} days left!`
                        : isOverdue
                        ? '❌ Overdue'
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
  );
}
