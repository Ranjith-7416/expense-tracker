let pieChart;

// 🔊 Sound
const clickSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

// ✅ Message
function showMessage(text) {
  const msg = document.getElementById("msg");
  if (!msg) return;
  msg.innerText = text;
  setTimeout(() => msg.innerText = "", 2000);
}

// 🌙 Dark mode
function toggleDark() {
  playClick();
  document.body.classList.toggle("dark");
}

// 💰 Set Income
function setBalance() {
  let income = +document.getElementById("initialBalance").value;
  if (!income) return showMessage("Enter income");

  localStorage.setItem("balance", income);
  localStorage.setItem("transactions", JSON.stringify([]));

  showMessage("Income set!");
}

// 📊 Set Budget
function setBudget() {
  let budget = +document.getElementById("budgetInput").value;
  if (!budget) return showMessage("Enter budget");

  localStorage.setItem("budget", budget);

  showMessage("Budget set!");
}

// ➕ Add Expense
if (document.getElementById("form")) {
  document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    let text = document.getElementById("text").value;
    let amount = +document.getElementById("amount").value;
    let category = document.getElementById("category").value;

    if (amount <= 0) return showMessage("Enter valid amount");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactions.push({ text, amount, category });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    this.reset();
    showMessage("Expense added!");
  });
}

// 📊 Dashboard
function updateDashboard() {
  const incomeEl = document.getElementById("income");
  if (!incomeEl) return;

  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");
  const budgetEl = document.getElementById("budget");
  const warning = document.getElementById("warning");

  let income = +localStorage.getItem("balance") || 0;
  let budget = +localStorage.getItem("budget") || 0;
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let totalExpense = 0;
  let categoryData = {};

  transactions.forEach(t => {
    totalExpense += t.amount;
    categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
  });

  let remaining = income - totalExpense;

  incomeEl.innerText = "₹" + income;
  expenseEl.innerText = "₹" + totalExpense;
  balanceEl.innerText = "₹" + remaining;
  budgetEl.innerText = "₹" + budget;

  if (budget && totalExpense > budget) {
    warning.innerText = "⚠ Budget Exceeded!";
  } else {
    warning.innerText = "";
  }

  if (pieChart) pieChart.destroy();

  if (document.getElementById("pieChart")) {
    pieChart = new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          data: Object.values(categoryData)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// 🔄 RESET (FINAL WORKING)
function resetData() {
  localStorage.clear();
  location.reload(); // 🔥 BEST RESET
}

// ▶ Run dashboard
window.onload = updateDashboard;