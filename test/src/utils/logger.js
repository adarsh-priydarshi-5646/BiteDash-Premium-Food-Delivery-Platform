export class Logger {
  constructor(name) {
    this.name = name;
    this.start = Date.now();
  }

  header(msg) {
    console.log('\n' + '='.repeat(80));
    console.log(`${this.name}`);
    console.log('='.repeat(80));
    console.log(msg);
  }

  section(title) {
    console.log(`\n[${title}]`);
    console.log('-'.repeat(60));
  }

  pass(msg) {
    console.log(`[PASS] ${msg}`);
  }

  fail(msg) {
    console.log(`[FAIL] ${msg}`);
  }

  info(msg) {
    console.log(`[INFO] ${msg}`);
  }

  metric(label, value, unit = '') {
    console.log(`  ${label}: ${value} ${unit}`);
  }

  duration() {
    const elapsed = ((Date.now() - this.start) / 1000).toFixed(2);
    console.log(`\nDuration: ${elapsed}s`);
  }
}
