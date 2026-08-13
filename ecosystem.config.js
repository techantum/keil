module.exports = {
  apps: [
    {
      name: "kk-engineering",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 8142",
      cwd: "/www/wwwroot/kkengineering",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 1023,
        ADMIN_USERNAME: "admin",
        ADMIN_PASSWORD: "admin123",
        SESSION_SECRET:
          "your-secret-key-change-in-production-kkengineering-2024",
        MONGODB_URI:
          "mongodb+srv://kkengineering:KKEngg%40123@kkengineering.fz1z9yb.mongodb.net/kkengineering?retryWrites=true&w=majority",
        USE_MONGODB: "true",
        // NEXT_PUBLIC_SITE_URL: "http://31.97.224.169:8142",

        // Gmail SMTP (Working) - Sends FROM sales@kkengineeringpharma.com
        SMTP_HOST: "smtp.gmail.com",
        SMTP_PORT: "587",
        SMTP_USER: "sudheer@sjmedialabs.com",
        SMTP_PASS: "mjoicoozoifsutnu",
      },
      error_file: "/www/wwwroot/kkengineering/logs/err.log",
      out_file: "/www/wwwroot/kkengineering/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
