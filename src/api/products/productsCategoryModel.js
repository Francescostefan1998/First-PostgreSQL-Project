import { DataTypes } from "sequelize";
import sequelize from "../../db.js";

const PoroductsCategoriesModel = sequelize.define("productsCategory", {
  id: {
    type: DataTypes.UUID,
    defzaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

export default PoroductsCategoriesModel;
