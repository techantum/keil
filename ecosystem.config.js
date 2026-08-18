module.exports = {
  apps: [
    {
      name: "keil",
      script: "node_modules/.bin/next",
      args: "start --port 6001",
      cwd: "/var/www/keil",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 6001,
        USE_POSTGRES: "true",
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/cms_starter",
        ADMIN_USERNAME: "admin",
        ADMIN_PASSWORD: "admin123",
        SUPER_ADMIN_USERNAME: "superadmin",
        SUPER_ADMIN_PASSWORD: "superadmin123",
        SESSION_SECRET:
          "94f47818e43d49c8e07fcbd373e0ee6ab10407da8abcab0017065146d461ed29",
      },
      error_file: "/var/www/keil/logs/err.log",
      out_file: "/var/www/keil/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
