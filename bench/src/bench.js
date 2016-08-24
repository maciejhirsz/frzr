
export function bench(name, iter) {
    console.log(`Benching ${name}`);

    const maxIterations = 1000000;
    let iterations = maxIterations;

    const start = performance.now();

    while (iterations--) iter();

    const totalNanos = (performance.now() - start) * 1e6;
    const average = totalNanos / maxIterations;
    const iterPerSec = 1e9 / average;


    console.log(`- ${Math.round(average)}ns per iteration (${iterPerSec | 0} ops/sec)`);
    console.log('');
}
