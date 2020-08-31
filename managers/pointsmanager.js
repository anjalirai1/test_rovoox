const Points = require("../models/points");

module.exports = async function savePoints(pointsToadd) {
  let points = new Points({
    points_added: pointsToadd,
  });
   return await points.save();
};
