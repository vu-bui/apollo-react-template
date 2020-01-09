module.exports = {
  apps: [{
    name: 'api',
    script: 'api/index.js',
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 10000,
    instances: 0,
    instance_var: 'INSTANCE_ID',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
