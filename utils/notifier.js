import Notification from "../models/Notification.js";

export const notify = async ({
  userType,
  userId = null,
  title,
  message
}) => {
  try {
    await Notification.create({
      userType,
      userId,
      title,
      message
    });

    console.log(`🔔 ${userType.toUpperCase()} NOTIFICATION:`, title);
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};