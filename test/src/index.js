import { testBackendAnalysis } from './tests/backend-analysis.test.js';
import { testFrontendAnalysis } from './tests/frontend-analysis.test.js';
import { testAPI } from './tests/api.test.js';
import { testPerformance } from './tests/performance.test.js';
import { testDatabase } from './tests/database.test.js';
import { testAutocannon } from './tests/autocannon-load.test.js';

async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('BITEDASH PRODUCTION TEST SUITE');
  console.log('='.repeat(80));

  const tests = [
    { name: 'Backend Code Analysis', fn: testBackendAnalysis },
    { name: 'Frontend Code Analysis', fn: testFrontendAnalysis },
    { name: 'API Test', fn: testAPI },
    { name: 'Performance Test', fn: testPerformance },
    { name: 'Database Test', fn: testDatabase },
    { name: 'Autocannon Load Test', fn: testAutocannon }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        console.log(`\n[PASS] ${test.name}`);
      } else {
        failed++;
        console.log(`\n[FAIL] ${test.name}`);
      }
    } catch (error) {
      failed++;
      console.log(`\n[FAIL] ${test.name}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total: ${tests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(2)}%`);
  console.log('='.repeat(80) + '\n');
}

runAllTests().catch(console.error);
