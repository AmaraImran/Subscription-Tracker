
import nodemailer from "nodemailer";
import Subscription from "../models/subscription.models.js";

import {
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from "../config/env.js";

const reminderTimezone = "Asia/Karachi";

// Get today's midnight in Pakistan time.
// This also works when Vercel runs in UTC.
const getReminderWindow = () => {
  const now = new Date();

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: reminderTimezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const parts = Object.fromEntries(
    dateParts.map(({ type, value }) => [type, value])
  );

  const pakistanMidnight = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day)
  ) - 5 * 60 * 60 * 1000;

  const start = new Date(pakistanMidnight);

  // Today through the next 7 days.
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 8);

  return { start, end };
};

const formatRenewalDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: reminderTimezone,
  }).format(date);

const createTransporter = () =>
  nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

// Main reminder function
const sendDueSubscriptionReminders = async (transporter) => {
  const { start, end } = getReminderWindow();

  console.log("Checking subscriptions between:", start, "and", end);

  const subscriptions = await Subscription.find({
    status: "active",
    renewaldate: { $gte: start, $lt: end },
    $or: [
      { reminderLastSentAt: { $lt: start } },
      { reminderLastSentAt: { $exists: false } },
    ],
  }).populate("user", "email name");

  console.log("Matching subscriptions:", subscriptions.length);

  if (subscriptions.length === 0) {
    console.log("No subscriptions need reminders right now.");
    return;
  }

  // Group subscriptions so each user receives one email.
  const subscriptionsByUser = new Map();

  for (const subscription of subscriptions) {
    if (!subscription.user) {
      console.warn(
        `Skipping subscription ${subscription._id}: user not found.`
      );
      continue;
    }

    if (!subscription.user.email) {
      console.warn(
        `Skipping subscription ${subscription._id}: user has no email.`
      );
      continue;
    }

    const userId = subscription.user._id.toString();

    const userSubscriptions = subscriptionsByUser.get(userId) ?? {
      user: subscription.user,
      subscriptions: [],
    };

    userSubscriptions.subscriptions.push(subscription);
    subscriptionsByUser.set(userId, userSubscriptions);
  }

  for (const {
    user,
    subscriptions: userSubscriptions,
  } of subscriptionsByUser.values()) {
    const subscriptionDetails = userSubscriptions
      .map(
        (subscription) =>
          `- ${subscription.name}: ${subscription.price} ${
            subscription.currency
          }, renews ${formatRenewalDate(subscription.renewaldate)}`
      )
      .join("\n");

    try {
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to: user.email,
        subject: "Upcoming subscription renewal reminder",
        text: [
          `Hi ${user.name || "there"},`,
          "",
          "These active subscriptions are due to renew within the next 7 days:",
          "",
          subscriptionDetails,
          "",
          "Review your subscriptions if you no longer want them to renew.",
        ].join("\n"),
      });

      console.log(
        `Reminder email accepted for ${user.email}: ${info.messageId}`
      );
    } catch (error) {
      console.error(
        `Failed to send reminder to ${user.email}:`,
        error.message
      );
      continue;
    }

    try {
      await Subscription.updateMany(
        {
          _id: {
            $in: userSubscriptions.map(({ _id }) => _id),
          },
        },
        {
          $set: {
            reminderLastSentAt: new Date(),
          },
        }
      );

      console.log(`Recorded reminders for ${user.email}`);
    } catch (error) {
      console.error(
        `Email was accepted, but recording the reminder failed for ${user.email}:`,
        error.message
      );
    }
  }
};

// This function will be called by the Vercel API endpoint.
export const runSubscriptionReminders = async () => {
  const smtpSettings = {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
  };

  const missingSettings = Object.entries(smtpSettings)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingSettings.length > 0) {
    throw new Error(
      `Missing SMTP settings: ${missingSettings.join(", ")}`
    );
  }

  if (
    !Number.isInteger(Number(SMTP_PORT)) ||
    Number(SMTP_PORT) < 1 ||
    Number(SMTP_PORT) > 65535
  ) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  const transporter = createTransporter();

  try {
    await sendDueSubscriptionReminders(transporter);
  } finally {
    transporter.close();
  }
};
