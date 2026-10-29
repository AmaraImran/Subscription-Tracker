# Subscription tracker backend

## Email renewal reminders

The backend checks active subscriptions once a day at 09:00 UTC and emails each
user once per day when one or more subscriptions are due today or within the
next seven days. Canceled, inactive, and expired subscriptions are not included.

Configure these variables in the backend's `.env.development.local` or
`.env.production.local` file (the file selected depends on `NODE_ENV`):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM="Subscription Tracker <no-reply@example.com>"
```

For implicit TLS, use the secure SMTP port provided by your email provider and
set `SMTP_SECURE=true`. Do not commit SMTP credentials. If SMTP settings are
missing, the backend starts normally but logs that email reminders are disabled.

The cron runs inside the backend process, so the backend must stay running for
scheduled reminders to be sent. Run one backend instance to avoid duplicate
reminders from multiple application replicas.
