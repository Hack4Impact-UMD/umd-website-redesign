const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

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
