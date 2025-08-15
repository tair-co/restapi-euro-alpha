const ApiToken = require("../models/ApiToken");
const BillingQuota = require("../models/BillingQuota");
const Workspace = require("../models/Workspace");
const { UnauthorizedError } = require("./ErrorHandling");

const middleware = async (req, res, next) => {
  const token = req.header("X-API-TOKEN");

  if (!token) {
    throw new UnauthorizedError().send(res);
  }

  try {
    const existingUser = await ApiToken.findOne({
      where: { token: token },
    });

    if (!existingUser) {
      throw new UnauthorizedError().send(res);
    }
    // checking workspace
    const existWorkspace = await Workspace.findOne({
      where: { user_id: existingUser.id },
    });

    if (!existWorkspace) {
      throw new UnauthorizedError().send(res);
    }

    const workspaceQuota = existWorkspace.billing_quota_id;
    if (workspaceQuota) {
      const quota = await BillingQuota.findOne({
        where: { id: workspaceQuota },
      });
      return next({ limit: quota.limit });
    }
  } catch (error) {
    throw new UnauthorizedError(error).send(res);
  }
  next();
};
module.exports = middleware;
