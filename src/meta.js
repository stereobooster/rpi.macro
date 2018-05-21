require("sharp")(process.argv[2]).toBuffer((err, data, info) => {
  console.log(JSON.stringify(info));
});
