// PM2 process config for DigitalOcean droplet deployment
// Usage: pm2 start ecosystem.config.cjs
// Scale across droplets: pm2 start ecosystem.config.cjs -i max

module.exports = {
  apps: [
    {
      name: 'metah4',
      script: './server/index.js',
      cwd: './',
      instances: 'max',      // use all CPU cores
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
