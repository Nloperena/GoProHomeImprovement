#!/usr/bin/env node

/**
 * Test API routes functionality
 */

console.log('=== API Routes Verification ===\n');

// Test 1: Verify config routes API endpoints to serverless
console.log('1. Checking Vercel output config...');
const { readFileSync, existsSync } = await import('fs');

const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf-8'));
const apiEstimateRoute = config.routes.find(r => r.src?.includes('/api/estimate'));
const apiTokenRoute = config.routes.find(r => r.src?.includes('/api/form-token'));

console.log('   /api/estimate route:', apiEstimateRoute ? `✓ Routes to ${apiEstimateRoute.dest}` : '✗ NOT FOUND');
console.log('   /api/form-token route:', apiTokenRoute ? `✓ Routes to ${apiTokenRoute.dest}` : '✗ NOT FOUND');

// Test 2: Verify API routes are NOT in static output
console.log('\n2. Checking static output directory...');
const hasStaticApi = existsSync('.vercel/output/static/api');
console.log('   Static /api directory:', hasStaticApi ? '✗ EXISTS (BAD)' : '✓ Does not exist (GOOD)');

// Test 3: Verify serverless function exists
console.log('\n3. Checking serverless function...');
const hasFunctionDir = existsSync('.vercel/output/functions/_render.func');
const hasServerEntry = existsSync('.vercel/output/_functions/entry.mjs');
console.log('   Function directory:', hasFunctionDir ? '✓ Exists' : '✗ Missing');
console.log('   Server entry:', hasServerEntry ? '✓ Exists' : '✗ Missing');

// Test 4: Check runtime version
const funcConfig = JSON.parse(readFileSync('.vercel/output/functions/_render.func/.vc-config.json', 'utf-8'));
console.log('   Runtime:', funcConfig.runtime === 'nodejs22.x' ? `✓ ${funcConfig.runtime}` : `✗ ${funcConfig.runtime}`);

// Test 5: Verify source files have prerender = false
console.log('\n4. Checking source file configuration...');
const estimateSource = readFileSync('src/pages/api/estimate.ts', 'utf-8');
const tokenSource = readFileSync('src/pages/api/form-token.ts', 'utf-8');
const hasEstimatePrerender = estimateSource.includes('export const prerender = false');
const hasTokenPrerender = tokenSource.includes('export const prerender = false');
console.log('   /api/estimate prerender = false:', hasEstimatePrerender ? '✓ Present' : '✗ Missing');
console.log('   /api/form-token prerender = false:', hasTokenPrerender ? '✓ Present' : '✗ Missing');

// Test 6: Verify middleware exists
console.log('\n5. Checking middleware...');
const hasMiddleware = existsSync('src/middleware.ts');
if (hasMiddleware) {
  const middlewareSource = readFileSync('src/middleware.ts', 'utf-8');
  const hasOnRequest = middlewareSource.includes('export const onRequest');
  const hasSecurityHeaders = middlewareSource.includes('Content-Security-Policy');
  console.log('   Middleware file:', '✓ Exists');
  console.log('   onRequest export:', hasOnRequest ? '✓ Present' : '✗ Missing');
  console.log('   Security headers:', hasSecurityHeaders ? '✓ Present' : '✗ Missing');
} else {
  console.log('   Middleware file:', '✗ Missing');
}

console.log('\n=== Summary ===');
const allGood = 
  apiEstimateRoute?.dest === '_render' &&
  apiTokenRoute?.dest === '_render' &&
  !hasStaticApi &&
  hasFunctionDir &&
  hasServerEntry &&
  funcConfig.runtime === 'nodejs22.x' &&
  hasEstimatePrerender &&
  hasTokenPrerender &&
  hasMiddleware;

if (allGood) {
  console.log('✓ All checks passed - API routes are serverless with Node 22\n');
  process.exit(0);
} else {
  console.log('✗ Some checks failed - review output above\n');
  process.exit(1);
}
