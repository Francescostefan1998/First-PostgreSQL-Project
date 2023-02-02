import express from "express";
import { DataTypes } from "sequelize";
import CategoriesModel from "../categories/model.js";
import PoroductsCategoriesModel from "./productsCategoryModel.js";
import sequelize from "../../db.js";

const ProductModel = sequelize.define("product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
ProductModel.belongsToMany(CategoriesModel, {
  through: PoroductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoriesModel.belongsToMany(ProductModel, {
  through: PoroductsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default ProductModel;
