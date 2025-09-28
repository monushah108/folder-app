import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client({
  clientId,
});

export async function verifyIdToken(idToken) {
  const LoginTicket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });
  const userData = LoginTicket.getPayload();
  return userData;
}
