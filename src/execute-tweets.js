const { executeScheduledTweets } = require("./controllers/tweet");

module.exports = (req, res) => {
    executeScheduledTweets()
    res.send({
      status: 200,
      message: "Executed Job",
    });
  };
  
