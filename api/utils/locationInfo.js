"use strict";
const axios = require("axios");

const generateLocInfoFromLatAndLong = async (latitude, longitude) => {
  const apiKey = "AIzaSyAZayBd_1QMbIZpRgTc9-QDvtrmuA-w-xI";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  const result = await axios.get(url);
  const requireFields = ["locality", "administrative_area_level_1", "country"];

  const axiosData = result.data?.results[0]?.address_components?.filter(
    (obj) =>
      // obj.types.includes("locality") |
      obj.types.includes("administrative_area_level_1") |
      obj.types.includes("country")
  );

  const locInfo = {};

  for (let i = 0; i < axiosData.length; i++) {
    // if (axiosData[i].types.includes("locality")) {
    //   // console.log("locality", axiosData[i].long_name);
    //   locInfo.city = axiosData[i].long_name + ", ";
    // }
    if (axiosData[i].types.includes("administrative_area_level_1")) {
      locInfo.state = axiosData[i].long_name;
    }
    if (axiosData[i].types.includes("country")) {
      locInfo.country = axiosData[i].long_name;
    }
  }

  if (locInfo) return locInfo;
};

module.exports = generateLocInfoFromLatAndLong;
