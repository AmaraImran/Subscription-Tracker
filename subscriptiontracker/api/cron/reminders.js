
import connectTodatabase from "../../database/mongodb.js";
import {
  runSubscriptionReminders,
} from "../../services/subscription-reminder.service.js";
import { CRON_SECRET } from "../../config/env.js";
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  // Verify Vercel Cron authorization
  const cronSecret = CRON_SECRET;

  if (!cronSecret) {
    return res.status(500).json({
      success: false,
      message: "CRON_SECRET is missing",
    });
  }

  if (req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    console.log("Daily subscription reminder cron started");

    // Connect to MongoDB
    await connectTodatabase();

    // Process subscription reminders
    await runSubscriptionReminders();

    console.log("Daily subscription reminder cron completed");

    return res.status(200).json({
      success: true,
      message: "Subscription reminders processed successfully",
    });
  } catch (error) {
    console.error("Subscription reminder cron failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process subscription reminders",
    });
  }
}
