const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("./config/config");
const app = express();
const generateAccessToken = require("./common/common");
const authenticateToken = require("./middlewares/authenticat");
const mongoose = require("mongoose");
const savePoints = require("./managers/pointsmanager");
const trackTime = require("./managers/timeManger");
const getTimeAndRequests = require("./managers/timeManger");
const saveUsers = require("./managers/usermanager");
const jwt = require("jsonwebtoken");
const {
  check,
  validationResult
} = require('express-validator');
const Points = require("./models/points");


const mongoUrl =
  "mongodb://<dbuser>:<dbpassword>@ds035735.mlab.com:35735/gameplay"
mongoose.connect(
  mongoUrl, {
    useNewUrlParser: true,
  },
  function (err, db) {
    if (err) {
      console.log(err);
      return;
    }
  }
);
app.set("Secret", config.secret);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.listen(3400, () => {
  console.log("server is running on port 3400");
});

//quest1
app.get("/now", (req, res) => {
  res.send(
    "<script>var r=new Date().valueOf() + ( " +
    new Date().getTimezoneOffset() +
    " - (new Date().getTimezoneOffset()) ) * -60000;" +
    'setInterval(()=>{document.body.innerHTML = (new Date(r+=1000)).toLocaleString("en",{weekday:"long", month:"long", day:"numeric", year:"numeric", hour:"numeric", minute:"numeric", second:"numeric", hour12:false})},1000);' +
    "</script>"
  );
});

//quest3
app.get("/me", async (req, res) => {
  let authToken = req.headers.authorization;
  let user = jwt.decode(authToken, {
    json: true
  }, config.secret)
  console.log('user', user);
  if (user) {
    let result = await Points.find({
      username: user.username
    })
    if (result && result.length > 0) {
      res.send({
        data: result
      });
    }else {
      res.send({
        success:false,
        message: 'No data found'
      })
    }
  } else {
    res.send({
      success: false,
      message: "Not Authorised",
    });
  }

});

//quest2
app.post("/register", [
  check('username', 'Username is string').isString(),
], async (req, res, next) => {
  // Check Errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg)
    });
  } else {
    //success,check in body username
    if (req && 'body' in req && req.body && 'username' in req.body && req.body.username) {
      //enerate accesstoken
      const token = generateAccessToken({
        username: req.body.username
      });
      res.json({
        token
      });
      //save username in table
      await saveUsers(req);
    } else {
      res.json({
        success: false,
        message: "Please provide username",
      })
    }
  }
});

//quest4
app.post("/game/play", [
  check('points_added', 'Points added is number').isInt()
], async (req, res) => {

  // Check Errors
  const errors = validationResult(req);
  console.log("error", errors)
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg)
    });
  } else {
    let pointsToadd;
    console.log("req", req.headers);
    if (req && "body" in req && req.body && "points_added" in req.body && req.body.points_added) {
      pointsToadd = req.body.points_added;
      console.log(pointsToadd);

      let authToken = req.headers.authorization;
      let user = jwt.decode(authToken, {
        json: true
      }, config.secret)
      console.log('user', user);
      if (user) {
        console.log("inside user", user.username)
        //First Get Time and requests from Time table
        await trackTime(user.username);

        res.send({
          success: true,
          message: "Successfully Saved",
        });

      } else {
        res.send({
          success: false,
          message: "Not Authorised",
        });
      }
    } else {
      res.send({
        success: false,
        message: "Please provide points added ",
      });
    }
  }

});