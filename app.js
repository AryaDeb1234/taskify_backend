require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // Import CORS
const mongoose = require("mongoose"); // Import mongoose

// Routes
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/users');

const app = express();

app.use((req, res, next) => {
  console.log("Auth Header:", req.headers.authorization);
  next();
});


// MongoDB Connection
mongoose.connect(process.env.DB_URL)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1); // Stop server if DB connection fails
});

// Passport JWT setup
const passport = require("passport");
require("./config/passport")(passport); // configure passport-jwt

// CORS setup (allow frontend to call API)
app.use(cors({
  origin: [
    "http://localhost:3000",           // Dev frontend
    "https://your-frontend.vercel.app" // Add your deployed frontend URL here
  ],
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport (JWT)
app.use(passport.initialize());

// View engine setup (KEEPING EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logger and static files
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRouter);
app.use('/task', taskRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;





















// require("dotenv").config();

// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const cors = require('cors'); // Import CORS
// const mongoose = require("mongoose"); //  Import mongoose

// const authRouter = require('./routes/auth');
// const taskRouter = require('./routes/users');

// const app = express();

// // MongoDB Connection
// mongoose.connect(process.env.db_url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log(" MongoDB connected"))
// .catch((err) => {
//   console.error(" MongoDB connection failed:", err.message);
//   process.exit(1); // Stop server if DB connection fails
// });

// // Passport & Session
// const passport = require("passport");
// require("./config/passport");

// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const flash = require("connect-flash");

// // CORS setup (allow frontend to call API)
// app.use(cors({
//   origin: "http://localhost:3000", // frontend URL during dev
//   credentials: true               // allow cookies/sessions to be sent
// }));

// // Express session
// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.secret_key,
//   store: MongoStore.create({
//     mongoUrl: process.env.db_url,
//     collectionName: "sessions"
//   }),
//   // cookie: {
//   //   maxAge: 1000 * 60 * 60, // 1 hour
//   //   httpOnly: true,
//   //   secure: process.env.NODE_ENV === "production", // send cookie only over HTTPS in production
//   //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" // allow cross-site cookies
//   // }
// //   cookie: {
// //   maxAge: 1000 * 60 * 60, // 1 hour
// //   httpOnly: true,
// //   secure: false, // for locally use
// //   sameSite: "lax" //  
// //  }
// cookie: {
//   maxAge: 1000 * 60 * 60, // 1 hour
//   httpOnly: true,
//   secure: true, // Cookies sent only over HTTPS
//   sameSite: "none" // Allow cross-origin cookies
// }
// }));


// app.use(flash());

// // Flash messages middleware
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash("success_msg"); // success messages
//   res.locals.error_msg = req.flash("error_msg");     // custom error messages
//   res.locals.error = req.flash("error");             // passport error messages
//   next();
// });

// // Express middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// // View engine setup (KEEPING EJS)
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // Other middlewares
// app.use(logger('dev'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes
// app.use('/', authRouter);

// app.use('/task', taskRouter);


// // Error handling
// app.use((req, res, next) => {
//   next(createError(404));
// });

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
