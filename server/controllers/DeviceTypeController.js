const deviceTypeServices = require("../services/deviceTypeServices");
const escape = require("escape-html");
const validation = require("../utils/validation");

exports.getAllDeviceTypes = async (req, res) => {
  let deviceTypes;
  try {
    deviceTypes = await deviceTypeServices.findAllDeviceTypes();
    if (!deviceTypes) {
      return res.status(404).json({ message: "לא קיימים סוגי מכשירים" });
    }
    return res.status(200).json(deviceTypes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.addNewDeviceType = async (req, res) => {
  const deviceName = escape(req.body.deviceName);
  let newDeviceType;
  try {
    if (!deviceName)
      return res.status(400).json({ message: "יש למלא את כל השדות" });
    const checkDeviceName = validation.addSlashes(deviceName);
    newDeviceType = await deviceTypeServices.addDeviceType(checkDeviceName);
    await newDeviceType.save();
    return res.status(200).json(newDeviceType);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

exports.deleteDeviceType = async (req, res) => {
  try {
      const { deviceTypeId } = req.body;
      await deviceTypeServices.deleteDeviceType(deviceTypeId);
      return res.status(200).json();
  } catch (err) {
      return res.status(401).json({ message: err.message });
  }
};
