// server/start-server.js
const { exec } = require('child_process');

// Set the NODE_OPTIONS environment variable to include the crypto module
process.env.NODE_OPTIONS = '--no-warnings --experimental-specifier-resolution=node';

// Start the NestJS application
const child = exec('npm run start:dev', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

child.stdout.on('data', (data) => {
    console.log(data);
});

child.stderr.on('data', (data) => {
    console.error(data);
});