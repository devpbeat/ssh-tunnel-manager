const Database = require('better-sqlite3');
const db = new Database('profiles.sqlite');

db.exec(`
  CREATE TABLE IF NOT EXISTS ssh_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user TEXT NOT NULL,
    host TEXT NOT NULL,
    key_path TEXT NOT NULL,
    local_port INTEGER NOT NULL,
    remote_host TEXT NOT NULL,
    remote_port INTEGER NOT NULL,
    pid INTEGER DEFAULT NULL
  );
`);

function getProfiles() {
  return db.prepare('SELECT * FROM ssh_profiles').all();
}

function addProfile(profile) {
  return db.prepare(`
    INSERT INTO ssh_profiles (name, user, host, key_path, local_port, remote_host, remote_port)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(profile.name, profile.user, profile.host, profile.key_path, profile.local_port, profile.remote_host, profile.remote_port);
}

function setPid(id, pid) {
  db.prepare('UPDATE ssh_profiles SET pid = ? WHERE id = ?').run(pid, id);
}

function clearPid(id) {
  db.prepare('UPDATE ssh_profiles SET pid = NULL WHERE id = ?').run(id);
}

module.exports = { getProfiles, addProfile, setPid, clearPid };