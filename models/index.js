const ApiToken = require("./ApiToken");
const Workspace = require("./Workspace");
const ServiceUsage = require("./ServiceUsage");
const Service = require("./Service");
const User = require("./User");
const BillingQuota = require("./BillingQuota");
const Chat = require("./Chat");

ApiToken.belongsTo(Workspace, { foreignKey: "workspaceId", as: "workspace" });
Workspace.hasMany(ApiToken, { foreignKey: "workspaceId", as: "apiTokens" });

ServiceUsage.belongsTo(ApiToken, { foreignKey: { allowNull: false } });
ServiceUsage.belongsTo(Service, { foreignKey: { allowNull: false } });

Workspace.belongsTo(User, { foreignKey: "user_id", as: "user" });
Workspace.hasMany(ApiToken, { foreignKey: "workspaceId" });
Workspace.hasOne(BillingQuota, { foreignKey: "workspaceId" });

Chat.belongsTo(Workspace, { foreignKey: "workspace_id", as: "workspace" });
Chat.belongsTo(User, { foreignKey: "userId", as: "user" });
