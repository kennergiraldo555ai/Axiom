const { spawn } = require('child_process');

async function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    console.log(`Setting ${key}...`);
    const proc = spawn('npx.cmd', ['vercel', 'env', 'add', key, 'production'], { shell: true });
    
    proc.stdout.on('data', d => console.log(`stdout: ${d}`));
    proc.stderr.on('data', d => console.error(`stderr: ${d}`));
    
    proc.stdin.write(value + '\n');
    proc.stdin.end();
    
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Failed with code ${code}`));
    });
  });
}

async function run() {
  try {
    // Vercel might complain if the variable already exists. We can rm it first.
    await new Promise(res => {
      const p = spawn('npx.cmd', ['vercel', 'env', 'rm', 'DATABASE_URL', 'production', '-y'], { shell: true });
      p.on('close', res);
    });
    await new Promise(res => {
      const p = spawn('npx.cmd', ['vercel', 'env', 'rm', 'DIRECT_URL', 'production', '-y'], { shell: true });
      p.on('close', res);
    });

    await addEnv('DATABASE_URL', 'postgresql://postgres.cswhbmtatwuymlvdyguh:%23KennerSgr555@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1');
    await addEnv('DIRECT_URL', 'postgresql://postgres.cswhbmtatwuymlvdyguh:%23KennerSgr555@aws-1-us-east-2.pooler.supabase.com:5432/postgres');
    
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
}
run();
