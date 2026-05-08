module.exports = {
  apps: [
    {
      name: 'lwo-admin',
      script: 'pnpm',
      args: '--filter=admin-site start',
      cwd: '/home/lwo/lwo', // Update this path to match your actual deployment path
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/admin-error.log',
      out_file: './logs/admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'lwo-cms',
      script: 'pnpm',
      args: '--filter=cms start',
      cwd: '/home/lwo/lwo', // Update this path to match your actual deployment path
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
      error_file: './logs/cms-error.log',
      out_file: './logs/cms-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
