import notification from "../models/notification.js";

export const notify = async ({
  userType,
  userId = null,
  title,
  message
}) => {
  try {
    await notification.create({
      userType,
      userId,
      title,
      message
    });

    console.log(`🔔 ${userType.toUpperCase()} NOTIFICATION:`, title);
  } catch (err) {
    console.error("notification error:", err.message);
  }
};
