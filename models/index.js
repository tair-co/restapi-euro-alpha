const ApiToken = require("./ApiToken");
const Workspace = require("./Workspace");
const ServiceUsage = require("./ServiceUsage");
const User = require("./User");
const BillingQuota = require("./BillingQuota");

ApiToken.belongsTo(Workspace, { foreignKey: "workspaceId", as: "workspace" });
Workspace.hasMany(ApiToken, { foreignKey: "workspaceId", as: "apiTokens" });

ServiceUsage.belongsTo(ApiToken, { foreignKey: { allowNull: false } });
ServiceUsage.belongsTo(Service, { foreignKey: { allowNull: false } });

Workspace.belongsTo(User, { foreignKey: { allowNull: false } });
Workspace.hasMany(ApiToken, { foreignKey: "workspaceId" });
Workspace.hasOne(BillingQuota, { foreignKey: "workspaceId" });
