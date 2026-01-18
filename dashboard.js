
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function redirectIfAdmin() {
  const { data, error } = await supabaseClient.rpc("is_admin");

  if (!error && data === true) {
    window.location.href = "admin.html";
  }
}

let userBalance = 0;

const userBalanceEl = document.getElementById("userBalance");
const diceDisplay = document.getElementById("diceDisplay");
const resultText = document.getElementById("resultText");
const transactionListEl = document.getElementById("transactionList");

document.addEventListener("DOMContentLoaded", async () => {
  const session = supabaseClient.auth.session();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  await redirectIfAdmin();

  await loadBalance();
  await loadTransactions();
});

async function loadBalance() {
  const session = supabaseClient.auth.session();
  const userId = session.user.id;

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return;
  }

  userBalance = data.reduce((sum, tx) => {
    if (tx.type === "deposit" || tx.type === "win") return sum + Number(tx.amount);
    if (tx.type === "play" || tx.type === "withdraw") return sum - Number(tx.amount);
    return sum;
  }, 0);

  updateBalances();
}

function updateBalances() {
  userBalanceEl.textContent = userBalance.toFixed(2);
}

async function addTransaction(type, amount) {
  const session = supabaseClient.auth.session();

  const { error } = await supabaseClient
    .from("transactions")
    .insert({
      user_id: session.user.id,
      type,
      amount
    });

  if (error) {
    console.error(error);
    alert("Transaction failed");
    return false;
  }

  return true;
}

async function loadTransactions() {
  const session = supabaseClient.auth.session();
  const userId = session.user.id;

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("type, amount, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  transactionListEl.innerHTML = "";

  if (!data || data.length === 0) {
    transactionListEl.innerHTML = "<p>No transactions yet</p>";
    return;
  }

  data.forEach(tx => {
    const div = document.createElement("div");
    div.className = "transaction";

    const positive = tx.type === "deposit" || tx.type === "win";
    const sign = positive ? "+" : "-";
    const color = positive ? "green" : "red";

    div.innerHTML = `
      <span>${tx.type.toUpperCase()}</span>
      <span style="color:${color}">
        ${sign}₦${Number(tx.amount).toFixed(2)}
      </span>
      <small>${new Date(tx.created_at).toLocaleString()}</small>
    `;

    transactionListEl.appendChild(div);
  });
}

async function deposit() {
  const amount = Number(document.getElementById("depositAmount").value);

  if (amount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  const success = await addTransaction("deposit", amount);
  if (!success) return;

  userBalance += amount;
  updateBalances();
  await loadTransactions();
}

async function rollDice() {
  const amount = Number(document.getElementById("playAmount").value);

  if (amount <= 0 || amount > userBalance) {
    alert("Invalid amount");
    return;
  }

  const playSuccess = await addTransaction("play", amount);
  if (!playSuccess) return;

  userBalance -= amount;

  const winChance = Math.random();
  let d1, d2;

  if (winChance <= 0.10) { d1 = 6; d2 = 6; }
  else if (winChance <= 0.35) { d1 = 6; d2 = 5; }
  else { d1 = Math.floor(Math.random() * 5) + 1; d2 = Math.floor(Math.random() * 5) + 1; }

  diceDisplay.textContent = `🎲 ${d1} 🎲 ${d2}`;

  if (d1 === 6 && d2 === 6) {
    const win = amount * 0.10;
    await addTransaction("win", amount + win);
    userBalance += amount + win;
    resultText.textContent = `🎉 Big Win! You earned 10% (₦${win.toFixed(2)})`;
  } 
  else if ((d1 === 6 && d2 === 5) || (d1 === 5 && d2 === 6)) {
    const win = amount * 0.05;
    await addTransaction("win", amount + win);
    userBalance += amount + win;
    resultText.textContent = `🎉 You won 5% (₦${win.toFixed(2)})`;
  } 
  else {
    resultText.textContent = "❌ You lost this round";
  }

  updateBalances();
  await loadTransactions();
}

async function withdraw() {
  const amount = Number(document.getElementById("withdrawAmount").value);

  if (amount <= 0 || amount > userBalance) {
    alert("Enter withdrawable amount");
    return;
  }

  const success = await addTransaction("withdraw", amount);
  if (!success) return;

  userBalance -= amount;
  updateBalances();
  await loadTransactions();

  alert("Withdrawal successful (demo)");
}

function logout() {
  supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

const players = ["Alex", "David", "Fatima", "Chinedu", "Aisha", "Samuel", "Inam"];
const playersList = document.getElementById("playersList");

setInterval(() => {
  playersList.innerHTML = "";
  const shuffled = players.sort(() => 0.5 - Math.random()).slice(0, 4);
  shuffled.forEach(p => {
    const div = document.createElement("div");
    div.className = "player";
    div.textContent = p + " is playing";
    playersList.appendChild(div);
  });
}, 2000);

const themeToggle = document.getElementById("themeToggle");

document.body.classList.remove("light");

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
});
