const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const authRouter = require("./router/authRouter");
const myRouter = require("./router/myRouter");
const videoRouter = require("./router/videoRouter");
const userRouter = require("./router/userRouter");

const config = require("./common/jwt_config");
const auth = require("./common/auth")();

dotenv.config();

const PORT = process.env.PORT;
const dbURI = process.env.MONGODB_URI;

const app = express();

app.use(helmet());
app.use(morgan("dev"));

const corsOptions = {
  methods: ["GET", "POST", "PATCH", "DELETE"]
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  mongoose
    .connect(dbURI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log(`✔ DB Connected`);
      next();
    })
    .catch(error => {
      console.log(`🚫 DB Connect Fail: ${error}`);
      next(error);
    });
});

app.use(auth.initialize());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/my", auth.authenticate(), myRouter);
app.use("/api/users", userRouter);
app.use("/api/video", videoRouter);

app.use(() => mongoose.disconnect());

app.listen(PORT, () => {
  console.log(`Listening on Port:${PORT}`);
});
