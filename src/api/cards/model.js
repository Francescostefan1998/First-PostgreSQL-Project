import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ProductModel from "../products/model.js";
import UsersModel from "../users/model.js";

const CardItemModel = sequelize.define("cardItem", {
  cardItemId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
});

UsersModel.hasMany(CardItemModel, { foreignKey: { allowNull: false } });
CardItemModel.belongsTo(UsersModel);
ProductModel.hasMany(CardItemModel, { foreignKey: { allowNull: false } });
CardItemModel.belongsTo(ProductModel);
export default CardItemModel;
