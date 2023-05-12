const Activity = require("../models/activity");

const serverError = require("../utils/serverError");

const activityNotFound = (res) => {
  const message = "Activity not found";
  return res.status(404).res.json({ message });
};

const getAllActivities = async ({ query }, res) => {
  try {
    const activities = await Activity.find(query);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const filteredByDateActivities = activities.filter((activity) => {
      const activityDate = new Date(
        activity.day.getFullYear(),
        activity.day.getMonth(),

        activity.day.getDate()
      );
      return activityDate >= today;
    });
    res.status(200).json(filteredByDateActivities);
  } catch (error) {
    serverError(res);
  }
};

const getActivityById = async ({ params: { id } }, res) => {
  try {
    const activity = await Activity.findById(id);

    res.status(200).json(activity);
  } catch (error) {
    serverError(res);
  }
};

const createActivity = async ({ body }, res) => {
  try {
    const activity = await Activity.create(body);
    res.status(201).json(activity);
  } catch (error) {
    serverError(res);
  }
};
const updateActivity = async ({ params: { id }, body }, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(id, body, { new: true });
    if (!activity) {
      activityNotFound(res);
    } else {
      res.status(200).json({ message: `activity ${id} updated` });
    }
  } catch (error) {
    serverError(res);
  }
};

const deleteActivity = async ({ params: { id } }, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      activityNotFound(res);
    } else {
      res.status(200).json({ message: `activity ${id} deleted` });
    }
  } catch (error) {
    serverError(res);
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
