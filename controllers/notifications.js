const admin = require("../config/firebase");
const User = require("../models/User");

const sendNotification = async (req, res) => {
  const { token, title, description, imageURl } = req.body;

  try {
    const response = await admin.messaging().send({
      token: token,
      data: {
        title: title,
        description: description,
        imageURl: imageURl,
      },
    });
    res
      .status(200)
      .send(`Notification Send Successsfully🚀: ${JSON.stringify(response)}`);
  } catch (error) {
    res.status(500).send(`Error Sending Notification: ${error.message}`);
  }
};

const broadcastNotification = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  try {
    const users = await User.find().select("device_token -_id");
    const deviceTokens = users?.map((user) => user.device_token);

    const response = await admin.messaging().sendEachForMulticast({
      tokens: deviceTokens,
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });
    res
      .status(200)
      .send(
        `Notification Broadcasted Successsfully🚀: ${JSON.stringify(response)}`
      );
  } catch (error) {
    res.status(500).send(`Error Broadcasting Notification: ${error.message}`);
  }
};

const registerToken = async (req, res) => {
  const { device_token } = req.body;

  try {
    let user = await User.findOne({ device_token });
    if (!user) {
      return res.status(200).send("Device token allready registerd");
    }
    user = new User({ device_token });
    await user.save();
    res.status(201).send("Device token registerd successfully 🚀");
  } catch (error) {
    res.status(500).send(`Error registering device token: ${error.message}`);
  }
};

module.exports = {
  sendNotification,
  broadcastNotification,
  registerToken,
};
