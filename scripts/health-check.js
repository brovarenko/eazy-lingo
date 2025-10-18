#!/usr/bin/env node

/**
 * Simple health-check script for the Eazy Lingo stack.
 * Verifies API and client endpoints respond with 2xx status codes.
 *
 * Configure via environment variables:
 *  - API_BASE_URL (default: http://localhost:4000/api)
 *  - CLIENT_URL   (default: http://localhost:3000)
 *  - REQUEST_TIMEOUT_MS (default: 5000)
 */

const DEFAULT_TIMEOUT = Number.parseInt(
  process.env.REQUEST_TIMEOUT_MS ?? '5000',
  10,
);

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000/api';
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:3000';

/**
 * Fetch wrapper with timeout support.
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const config = { ...options, signal: controller.signal };

  try {
    return await fetch(url, config);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Run a single check.
 */
async function runCheck({
  name,
  url,
  expectStatus = 200,
  init = {},
  redactResponse = false,
}) {
  const start = performance.now();
  try {
    const response = await fetchWithTimeout(url, { method: 'GET', ...init });
    const duration = performance.now() - start;

    if (response.status !== expectStatus) {
      const body = redactResponse ? '' : await response.text();
      return {
        name,
        ok: false,
        status: response.status,
        duration,
        message: `Expected status ${expectStatus} but received ${response.status} (${body.slice(
          0,
          120,
        )})`,
      };
    }

    return { name, ok: true, status: response.status, duration };
  } catch (error) {
    const duration = performance.now() - start;
    return { name, ok: false, error, duration };
  }
}

async function main() {
  const checks = [
    {
      name: 'api-health',
      url: `${API_BASE_URL}/health`,
      expectStatus: 200,
    },
    {
      name: 'client-home',
      url: CLIENT_URL,
      expectStatus: 200,
    },
  ];

  if (process.env.CHECK_COMMON_SETS === 'true') {
    const headers = {};
    if (process.env.HEALTH_CHECK_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${process.env.HEALTH_CHECK_ACCESS_TOKEN}`;
    }
    if (process.env.HEALTH_CHECK_COOKIE) {
      headers.Cookie = process.env.HEALTH_CHECK_COOKIE;
    }
    checks.splice(1, 0, {
      name: 'common-sets',
      url: `${API_BASE_URL}/sets?isCommon=true`,
      expectStatus: Number.parseInt(
        process.env.COMMON_SETS_EXPECT_STATUS ?? '200',
        10,
      ),
      init: { headers },
      redactResponse: Boolean(process.env.HEALTH_CHECK_COOKIE),
    });
  }

  console.log('Running health-checks...');
  console.log(
    `API base: ${API_BASE_URL}, Client: ${CLIENT_URL}, timeout: ${DEFAULT_TIMEOUT}ms\n`,
  );

  const results = [];
  for (const check of checks) {
    const result = await runCheck(check);
    results.push(result);
    if (result.ok) {
      console.log(
        `✅ ${check.name} (${result.status}) ${result.duration.toFixed(0)}ms`,
      );
    } else if (result.status) {
      console.error(
        `❌ ${check.name} (${result.status}) ${result.duration.toFixed(
          0,
        )}ms - ${result.message}`,
      );
    } else {
      console.error(
        `❌ ${check.name} failed after ${result.duration.toFixed(0)}ms - ${
          result.error?.message ?? result.error
        }`,
      );
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\nHealth-check failed (${failed.length} of ${checks.length})`);
    process.exit(1);
  } else {
    console.log('\nAll health-checks passed ✅');
  }
}

main().catch((error) => {
  console.error('Unexpected error during health-check:', error);
  process.exit(1);
});
