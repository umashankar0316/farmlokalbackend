export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Retrying... attempts left: ${retries}`);
    await new Promise((res) => setTimeout(res, delay));
    return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
  }
}