import { Plan } from "../models/plan.js";
import { User } from "../models/user.js";

export function viewPlans(req, res, next) {
  Plan.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 404;
      next(err);
    });
}

export function onSubscribePlan(req, res, next) {
  const userId = req.userId;
  const planId = req.params.id;
  let selectedPlan;
  Plan.findById(planId)
    .select("-password")
    .then((plan) => {
      selectedPlan = plan;
      return User.findById(userId);
    })
    .then((user) => {
      user.membership = selectedPlan;
      user.membershipStartDate = new Date();
      var expDate = new Date();
      user.membershipEndDate = expDate.setDate(expDate.getDate() + 30);
      return user.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 404;
      next(err);
    });
}

export function onUnsubscribePlan(req, res, next) {
  const userId = req.userId;
  User.findById(userId)
    .select("-password")
    .then((user) => {
      user.membership = null;
      user.membershipStartDate = null;
      user.membershipEndDate = null;
      return user.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 404;
      next(err);
    });
}
