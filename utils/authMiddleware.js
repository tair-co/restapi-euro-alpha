const ApiToken = require("../models/ApiToken");
const BillingQuota = require("../models/BillingQuota");
const Service = require("../models/Service");
const ServiceUsage = require("../models/ServiceUsage");
const Workspace = require("../models/Workspace");
const { UnauthorizedError, ForbiddenError } = require("./ErrorHandling");

const middleware = async (req, res, next) => {
  const token = req.header("X-API-TOKEN");

  if (!token) {
    throw new UnauthorizedError().send(res);
  }

  try {
    const existingToken = await ApiToken.findOne({
      raw: true,
      where: { token: token },
    });
    if (!existingToken) {
      throw new UnauthorizedError().send(res);
    }
    // checking workspace
    const existWorkspace = await Workspace.findOne({
      raw: true,
      where: { id: existingToken.workspace_id },
    });

    if (!existWorkspace) {
      throw new UnauthorizedError().send(res);
    }
    const workspaceQuota = existWorkspace.billing_quota_id;

    if (workspaceQuota) {
      const quota = await BillingQuota.findOne({
        raw: true,
        where: { id: workspaceQuota },
      });

      const serviceUsages = await ServiceUsage.findAll({
        where: { api_token_id: existingToken.id },
      });
      const services = await Service.findAll({
        where: {
          id: [...new Set(serviceUsages.map((usage) => usage.service_id))],
        },
      });
      const countServicesQuota = services.reduce((acc, service) => {
        return (
          acc +
          service.cost_per_ms *
            (serviceUsages.find((usage) => usage.service_id === service.id)
              ?.duration_in_ms || 0)
        );
      }, 0);
      console.log(" Current Services Quota:", countServicesQuota);
      req.limit = quota.limit - countServicesQuota;

      if (req.limit < 0) {
        throw new ForbiddenError("Billing quota exceeded").send(res);
      }
      if (countServicesQuota >= quota.limit) {
        throw new ForbiddenError("Billing quota exceeded").send(res);
      }
    }
    req.token_id = existingToken.id;
  } catch (error) {
    throw new UnauthorizedError(error).send(res);
  }
  next();
};
module.exports = middleware;
