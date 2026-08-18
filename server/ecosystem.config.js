module.exports = {
  apps: [
    {
      name: 'depayhub-api',
      script: 'dist/index.js',
      instances: 'max', // Run in cluster mode utilizing all CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
