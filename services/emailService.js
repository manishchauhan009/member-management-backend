const nodemailer = require("nodemailer");
const Member = require("../models/memberSchema");
require("dotenv").config();
const cron = require("node-cron");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMembershipReminderEmails = () => {
  cron.schedule("30 11 * * *", async () => {
    console.log("Cron job triggered at:", new Date().toISOString());

    try {
      const today = new Date();
      const memberships = await Member.find();

      console.log(`Processing ${memberships.length} memberships...`);

      await Promise.all(
        memberships.map(async (membership) => {
          const expiryDate = new Date(membership.expiryDate);
          const diffInDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

          if (diffInDays <= 7 && membership.remindersSent < 3) {
            try {
              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: membership.email,
                subject: "Membership Expiry Reminder",
                html: `<p>Hello ${membership.firstName} ${
                  membership.middleName || ""
                } ${membership.lastName},</p>
                  <p>Your membership will expire in <strong>${diffInDays} days</strong>. Please renew soon!</p>`,
              });

              console.log(`Reminder sent to ${membership.email}`);
              membership.remindersSent += 1;
              await membership.save();
            } catch (emailError) {
              console.error(`Failed to send email to ${membership.email}:`, emailError.message);
            }
          }
        })
      );

      console.log("Cron job execution completed.");
    } catch (err) {
      console.error("Error fetching memberships or sending reminders:", err.message);
    }
  });
};

module.exports = sendMembershipReminderEmails;
