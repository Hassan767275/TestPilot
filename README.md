# TestPilot

TestPilot tests web apps for you. Paste in a URL, and it sends simulated users through your site, runs load and security checks, and gives you a report on what broke and why.

## What it does

- **Browser testing**: simulated users sign up, log in, and fill out forms using Playwright
- **Load testing**: hits your site with lots of users at once using k6
- **Fault testing**: simulates API failures, slow responses, and timeouts
- **Security checks**: basic checks for XSS, SQL injection, and rate limiting
- **AI reports**: summarizes the results and points out likely causes of failures
- **Live dashboard**: watch tests run in real time

## How it works

```
Dashboard (Next.js) → API (Express) → Job queue (Redis + BullMQ) → Workers (Playwright / k6) → Results (PostgreSQL)
```

The API adds each test to a queue, and separate workers pick up jobs and run them. That way the API stays fast, and more workers can be added if needed. Progress is sent back to the dashboard over WebSockets.

## Tech stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Data:** PostgreSQL (Supabase), Redis + BullMQ
- **Testing:** Playwright, k6
- **AI:** OpenAI API
- **Deployment:** Docker, AWS
