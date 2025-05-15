const { spawn } = require('child_process');
const db = require('./db');

const processes = new Map();

function startTunnel(profile) {
  const args = [
    '-i', profile.key_path,
    '-L', `${profile.local_port}:${profile.remote_host}:${profile.remote_port}`,
    '-N', '-C',
    `${profile.user}@${profile.host}`
  ];

  const ssh = spawn('ssh', args, { detached: true });

  processes.set(profile.id, ssh);
  db.setPid(profile.id, ssh.pid);

  ssh.on('exit', () => {
    db.clearPid(profile.id);
    processes.delete(profile.id);
  });

  return ssh.pid;
}

function stopTunnel(profileId) {
  const ssh = processes.get(profileId);
  if (ssh) {
    process.kill(-ssh.pid);
    db.clearPid(profileId);
    processes.delete(profileId);
  }
}

module.exports = { startTunnel, stopTunnel };
