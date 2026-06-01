import { exec } from 'child_process';

exec('lsof -i :5000 -t', (error, stdout, stderr) => {
    if (error || !stdout.trim()) {
        console.log('No process running on port 5000');
        return;
    }
    const pid = stdout.trim();
    console.log(`Killing process ${pid} on port 5000`);
    exec(`kill -9 ${pid}`, (err) => {
        if (err) {
            console.error(`Failed to kill process: ${err}`);
        } else {
            console.log(`Successfully killed process ${pid}`);
        }
    });
});
