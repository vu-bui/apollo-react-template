module.exports = {
  apps: [{
    name: 'api',
    script: 'src/api/index.ts',
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 10000,
    instance_var: 'INSTANCE_ID',
    watch: ['src', 'types'],
    // FIXME workaround for windows development machine
    // https://github.com/Unitech/pm2/issues/2675#issuecomment-386418497
    exec_mode: 'cluster',
    instances: 1
  }],
};
