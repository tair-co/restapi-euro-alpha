const ApiToken = require("./ApiToken");
const Workspace = require("./Workspace");
const ServiceUsage = require("./ServiceUsage");
const Service = require("./Service");
const User = require("./User");
const BillingQuota = require("./BillingQuota");
const Chat = require("./Chat");

ApiToken.belongsTo(Workspace, { foreignKey: "workspace_id", as: "workspace" });
Workspace.hasMany(ApiToken, { foreignKey: "workspace_id", as: "apiTokens" });

ServiceUsage.belongsTo(ApiToken, { foreignKey: "api_token_id" });
ServiceUsage.belongsTo(Service, { foreignKey: "service_id" });

Workspace.belongsTo(User, { foreignKey: "user_id", as: "user" });
Workspace.hasMany(ApiToken, { foreignKey: "workspace_id" });

Chat.belongsTo(Workspace, { foreignKey: "workspace_id", as: "workspace" });
Chat.belongsTo(User, { foreignKey: "userId", as: "user" });
