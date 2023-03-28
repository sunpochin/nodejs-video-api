const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// 設定 Passport 身分驗證套件
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

const redirectURI = 'auth/google/callback';


passport.use(
	new GoogleStrategy(
		{
			clientID:
				'266847528060-86qmub9fgtbtavdkvicc98h5qmot8iub.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: 'http://localhost:8000/auth/google/callback',
			passReqToCallback: true,
		},
		function (request, accessToken, refreshToken, profile, done) {
			console.log('profile: ', profile);
			return done(null, profile);
		}
	)
);
