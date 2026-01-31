// api.js — all backend calls in one place

const BASE_URL = "http://147.182.158.24:7000"; // your droplet IP + port

async function request(path, { method = "GET", body = null } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  // Try to parse JSON; if not JSON, fall back to text
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}\n${text}`);

    // FastAPI HTTPException.detail often comes back as JSON; handle both
    const message =
      (data && typeof data === "object" && data.detail) ||
      (typeof data === "string" ? data : "Request failed");
    throw new Error(message);
  }

  return data;
}

// ---------- POST endpoints ----------

export async function saveQuestionnaire(payload) {
  // Some backend code expects top-level keys in addition to the nested `quiz` object.
  // We duplicate commonly-required fields at the top level to avoid KeyError crashes.
  return request("/save_questionnaire", {
    method: "POST",
    body: {
      quiz: payload.quiz,
      user_ID: payload.user_ID,
      yesterday_goal: payload.yesterday_goal,
      tomorrow: payload.tomorrow,
      date: payload.date,
    },
  });
}

export async function saveJournalEntry(payload) {
  // payload should match what your save_journal expects
  return request("/save_journal_entry", { method: "POST", body: payload });
}

export async function aiRequest(payload) {
  // payload example:
  // {
  //   content: "text",
  //   date: 1706668800,
  //   user_ID: "1adsa2aaf3",
  //   read_journal: true,
  //   create_quiz: true
  // }
  return request("/ai_request", { method: "POST", body: payload });
}

// ---------- GET endpoints ----------

export async function getQuiz(quiz_id) {
  return request(`/get_quiz?quiz_id=${encodeURIComponent(quiz_id)}`);
}

export async function getJournal(journal_id) {
  return request(`/get_journal?journal_id=${encodeURIComponent(journal_id)}`);
}

export async function getAll(user_ID) {
  return request(`/get_all?user_ID=${encodeURIComponent(user_ID)}`);
}



//usage example below. MAKE SURE THE INPUT DATA IS EXACTLY AS EXAMPLES. finally, create a file called package.json if not alr, and put inside:


export async function testSaveQuiz() {
  const body = {
    quiz: {
      Q1: Math.floor(Math.random() * 10) + 1,
      Q2: Math.floor(Math.random() * 10) + 1,
      Q3: Math.floor(Math.random() * 10) + 1,
    },
    user_ID: "1adsa2aaf3",
    yesterday_goal: Math.random() < 0.5 ? 0 : 1, // boolean-as-int
    tomorrow: "auto-generated goal for tomorrow",
    date: Math.floor(Date.now() / 1000),
  };

  const res = await saveQuestionnaire(body);
  console.log("quiz saved:", res);
}



export async function testGetAll() {
  const res = await getAll("1adsa2aaf3");
  console.log("all data:", JSON.stringify(res, null, 2));
}

export async function testAiRequest() {
  const payload = {
    content: "I struggled this week with math and felt slower than everyone else.",
    date: Math.floor(Date.now() / 1000),
    user_ID: "1adsa2aaf3",
    read_journal: true,
    read_quizzes: true,
  };

  const res = await aiRequest(payload);
  console.log("AI response:", res);
}

// export async function testSaveJournal() {
//   const journal = {
//     user_ID: "1adsa2aaf3",
//     title: "test journal",
//     content: "This is a test journal entry generated at " + new Date().toISOString(),
//     date: Math.floor(Date.now() / 1000),
//   };
//
//   const res = await saveJournalEntry(journal);
//   console.log("journal saved:", res);
// }
// TEMP: run test directly if executed with node
async function runTests() {
  await testSaveQuiz();
  await testGetAll();
  await testAiRequest();
}

runTests().catch(console.error);
