# Condition-Based Waiting — Replace Arbitrary Timeouts

> **Purpose**: Replace arbitrary `sleep()` / `setTimeout()` calls with condition polling. Arbitrary waits are fragile — they either wait too long (wasting time) or not long enough (causing flaky failures).

---

## The Technique

Instead of sleeping for a fixed duration and hoping the condition is met, **poll for the actual condition** with a timeout ceiling.

### Anti-Pattern vs Pattern

```python
# ❌ Arbitrary wait — fragile, slow, unreliable
import time
time.sleep(5)  # "should be enough"
result = check_status()

# ✅ Condition-based wait — precise, fast, reliable
import asyncio

async def wait_for_condition(
    check: Callable[[], Awaitable[bool]],
    timeout: float = 30.0,
    interval: float = 0.5,
    description: str = "condition",
) -> None:
    """Poll until check() returns True, or raise on timeout."""
    elapsed = 0.0
    while elapsed < timeout:
        if await check():
            return
        await asyncio.sleep(interval)
        elapsed += interval
    raise TimeoutError(f"Timed out waiting for {description} after {timeout}s")
```

---

## PathForge Examples

### 1. Waiting for Background Job Completion (ARQ)

```python
# ❌ Anti-pattern: fixed sleep after enqueuing
await arq_pool.enqueue_job("generate_career_dna", user_id=user_id)
await asyncio.sleep(10)  # "should be done by now"
career_dna = await get_career_dna(session, user_id)

# ✅ Condition-based: poll for the result
await arq_pool.enqueue_job("generate_career_dna", user_id=user_id)
await wait_for_condition(
    check=lambda: career_dna_exists(session, user_id),
    timeout=30.0,
    interval=1.0,
    description="Career DNA generation",
)
career_dna = await get_career_dna(session, user_id)
```

### 2. Waiting for LLM Response in Tests

```python
# ❌ Anti-pattern: fixed sleep in test
await service.run_analysis(user_id)
await asyncio.sleep(5)
assert await get_analysis_count(session, user_id) == 1

# ✅ Condition-based: poll for the expected state
await service.run_analysis(user_id)
await wait_for_condition(
    check=lambda: get_analysis_count(session, user_id) == 1,
    timeout=15.0,
    interval=0.5,
    description="analysis record creation",
)
```

### 3. Frontend: Waiting for Server State (React)

```typescript
// ❌ Anti-pattern: fixed setTimeout
const handleUpload = async () => {
  await uploadResume(file);
  setTimeout(() => refetchCareerDNA(), 3000); // "server should be done"
};

// ✅ Condition-based: poll with TanStack Query
const handleUpload = async () => {
  await uploadResume(file);
  // TanStack Query handles polling via refetchInterval
  // or use manual polling:
  const MAX_ATTEMPTS = 10;
  const INTERVAL_MS = 2000;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const result = await fetchCareerDNA();
    if (result.status === "completed") return result;
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
  }
  throw new Error("Career DNA generation timed out");
};
```

---

## When to Use

- **After enqueuing background jobs** (ARQ, Celery, task queues)
- **In integration tests** waiting for async side effects (DB writes, event handlers)
- **In CI pipelines** waiting for services to become healthy
- **In frontend** waiting for server-side processing to complete
- **Anywhere you see `sleep()` or `setTimeout()` with a comment like "should be enough"**

## When NOT to Use

- When the system provides a **callback or webhook** — use that instead
- When **WebSocket or SSE** push notifications are available — subscribe instead
- For **rate limiting delays** — those are intentional fixed waits

---

## Key Principle

> **Never wait for time. Wait for state.** If you're sleeping and hoping, you're building a flaky system. Poll for the condition you actually need.
