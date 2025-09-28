import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";


passport.use(
  new GitHubStrategy(
    {
      clientID: CLIENT_Id,
      clientSecret: CLIENT_SECRET,
      callbackURL,
    },
    function (accessToken, refreshToken, profile, done) {
      const email = profile.emails?.[0]?.value || `${profile.id}@github.com`;
      const user = {
        name: profile.displayName || profile.username,
        email,
        picture: profile._json.avatar_url,
      };
      return done(null, user);
    }
  )
);
