```javascript
alert("APP.JS LOADED");

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const pollDefinitions = {
  faction: ["Alliance", "Horde", "No Preference"],
  role: ["Tank", "DPS", "Heal"],
  raid_ready: ["Yes", "No", "Fuck no, enjoy the journey"],
  raid_nights: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  tradeskill: ["Blacksmithing", "Leatherworking", "Alchemy", "Enchanting", "Tailoring", "Engineering", "Gathering"]
};

async function loadResults() {
  const { data, error } = await client
    .from("poll_votes")
    .select("poll, choice");

  if (error) {
    console.error("Supabase results error:", error);
    setStatus("Unable to load results. Check the Supabase setup.", true);
    return;
  }

  const counts = {};

  for (const poll of Object.keys(pollDefinitions)) {
    counts[poll] = {};

    for (const choice of pollDefinitions[poll]) {
      counts[poll][choice] = 0;
    }
  }

  for (const row of data || []) {
    if (counts[row.poll] && row.choice in counts[row.poll]) {
      counts[row.poll][row.choice]++;
    }
  }

  for (const [poll, choices] of Object.entries(counts)) {
    const total = Object.values(choices).reduce((a, b) => a + b, 0);
    const container = document.getElementById(`results-${poll}`);

    if (!container) {
      console.error(`Missing results container: results-${poll}`);
      continue;
    }

    container.innerHTML = Object.entries(choices).map(([choice, count]) => {
      const pct = total ? Math.round((count / total) * 100) : 0;

      return `
        <div class="result-row">
          <span>${escapeHtml(choice)}</span>
          <div class="bar">
            <div class="fill" style="width:${pct}%"></div>
          </div>
          <strong>${count}</strong>
        </div>
      `;
    }).join("");
  }
}

document.getElementById("pollForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const nights = [...document.querySelectorAll('input[name="raid_nights"]:checked')]
    .map(input => input.value);

  if (!nights.length) {
    setStatus("Please select at least one raid night.", true);
    return;
  }

  const tradeskills = getTradeskills();

  if (tradeskills.length > 2) {
    setStatus("Please select no more than two tradeskills.", true);
    return;
  }

  const rows = [
    ["faction", getRadio("faction")],
    ["role", getRadio("role")],
    ["raid_ready", getRadio("raid_ready")],
    ...nights.map(night => ["raid_nights", night]),
    ...tradeskills.map(skill => ["tradeskill", skill])
  ].map(([poll, choice]) => ({
    poll,
    choice
  }));

  const button = document.getElementById("submitBtn");
  button.disabled = true;
  setStatus("Submitting...");

  const { error } = await client
    .from("poll_votes")
    .insert(rows);

  button.disabled = false;

  if (error) {
    console.error("Supabase submission error:", error);
    setStatus("Something went wrong submitting your choices.", true);
    return;
  }

  setStatus("Your choices have been recorded. Thank you!");

  event.target.reset();

  await loadResults();
});

function getRadio(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);

  if (!selected) {
    throw new Error(`No selection made for ${name}`);
  }

  return selected.value;
}

function getTradeskills() {
  return [...document.querySelectorAll('input[name="tradeskill"]:checked')]
    .map(input => input.value);
}

function setStatus(message, error = false) {
  const el = document.getElementById("status");

  if (!el) {
    console.error("Status element not found:", message);
    return;
  }

  el.textContent = message;
  el.style.color = error ? "#ffdddd" : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

loadResults();
```
