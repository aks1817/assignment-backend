const calculatePriority = (due_date) => {
  const today = new Date();
  const dueDate = new Date(due_date);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 0;
  } else if (diffDays >= 1 && diffDays <= 2) {
    return 1;
  } else if (diffDays >= 3 && diffDays <= 4) {
    return 2;
  } else {
    return 3;
  }
};

module.exports = { calculatePriority };
