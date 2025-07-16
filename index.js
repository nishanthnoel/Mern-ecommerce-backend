const express = require("express");
const server = express();
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser") //for cookies from client side

const { createProduct } = require("./controller/Product");
const productsRouters = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require("path");

const SECRET_KEY = "SECRET_KEY";

//JWT options
const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); without cookies
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

//middlewares
server.use(cors({
  origin: "http://localhost:3000", // your React app's URL
  credentials: true,               // allow cookies to be sent
  exposedHeaders: ["X-Total-Count"]
}));//To protect users. Without it, any website could secretly make requests to any other site where you're logged in — that would be a security risk.
// server.use(express.static (path.join(__dirname, "build")))
// server.use(express.static( "build"))
server.use(cookieParser())  //TO EXTRACT THE COOKIES FROM REQ.COOKIES
server.use(
  session({
    secret: "your_secret_key", // use an env variable in production
    resave: false,
    saveUninitialized: false,
  })
);
server.use(passport.authenticate("session"));
server.use(express.json()); //to parse req.body
// server.use("/products", isAuth, productsRouters.router); //we can use jwt toke for client auth only
server.use("/products", isAuth(), productsRouters.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/users", isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);

// Passport Local Strategy
passport.use(
  "local",
  new LocalStrategy({usernameField: "email"}, async function (
    // usernameField has been added as email.
    // username, // we pass email at all the places
    email,
    password,
    done
  ) {
    {
      try {
        // const user = await User.findOne({ email: username }).exec();
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
          done(null, false, { message: "no such user email" });
          // return res.status(401).json({ message: "no such user email" });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async (err, hashedPassword) => {
            if (err) {
              return done(err);
            }
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            } else {
              //creating a token
              const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
              // done(null, sanitizeUser(user)); // this line sends to serialize //old code
              return done(null, {token});
            }
          }
        );
      } catch (err) {
        return done(err);
      }
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log(jwt_payload);

    try {
      const user = await User.findById( jwt_payload.id); //this is also a important part
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serializer
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//this creates session variable req.user on being called
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

//this changes session variable req.user when called from authorized requests
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);

  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/ecommerce");
  console.log("database connected");
}
// server.post("/products", (req, res)=>{
//     createProduct()
//     res.json({status:"success"})
// })

// server.get("/", (req, res) => {
//   res.json({ status: "success" });
// });

// server.post("/products", createProduct); // this routing is done in routes/Products.js

server.listen(8080, () => {
  console.log("server started");
});
