import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import CategoriesModel from "../categories/model.js";
import ProductModel from "../products/model.js";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// 1 to many relationship
UsersModel.hasMany(ReviewsModel, { foreignKey: { allowNull: false } });
ReviewsModel.belongsTo(UsersModel);
ProductModel.hasMany(ReviewsModel, { foreignKey: { allowNull: false } });
ReviewsModel.belongsTo(ProductModel);

export default ReviewsModel;
