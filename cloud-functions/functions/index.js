const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

require(dotenv).config();
const nodemailer = require("nodemailer");

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID, // ClientID
  process.env.OAUTH_CLIENT_SECRET, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH,
});
const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "" /* Enter in email here once nodemailer setup is done*/,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH,
    accessToken: accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.updateUserEmail = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.email != null &&
        data.newEmail != null &&
        auth &&
        auth.token &&
        auth.token.email.toLowerCase() == data.email.toLowerCase() &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        await authorization
          .updateUser(auth.uid, {
            email: data.newEmail,
          })
          .catch((error) => {
            reject(
              new functions.https.HttpsError(
                "unknown",
                "Failed to change user's email."
              )
            );
            functions.logger.error("Unknown", "Failed to change user's email.");
          });
      } else {
        reject(
          new functions.https.HttpsError(
            "unknown",
            "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use."
          )
        );
        functions.logger.error(
          "unknown",
          "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use."
        );
      }
    });
  }
);
