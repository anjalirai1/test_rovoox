const Time = require("../models/time");
const moment = require("moment");
module.exports = async function trackTime(username) {
  console.log("inside track time", username);
  let timeData = await Time.find({
    username: username
  });
  console.log("timeData", timeData, timeData.length)
  if (timeData && timeData.length < 5) {
    if (timeData.length === 0) {
      let time = new Time({
        start_time: moment.utc().valueOf(),
        request: 1,
        username: username,
        end_time: moment.utc().add(1, 'hour').valueOf()
      });
      return await time.save(function (err) {
        console.log("inside save")
        if (err) {
          return console.log(err);

        } else {
          console.log("inside created")
          return 'time saved'
        }
      });
    }else{
      if(timeData[0].request<6 && timeData.start_time){
      await Time.findOneAndUpdate({username: username,"difference": {
        "$divide": [
          { "$subtract": ["$start_time", "$end_time"] },
          60 * 1000 * 60
        ]
      }
      }, {request: timeData[0].request+1});
      }
    }
  }

};

// module.exports = async function getTimeAndRequests(username) {
//   return;
// };