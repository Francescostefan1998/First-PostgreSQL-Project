import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./model.js";
import { Op } from "sequelize";
import CategoriesModel from "../categories/model.js";
import PoroductsCategoriesModel from "./productsCategoryModel.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductModel.create(req.body);
    if (req.body.categories) {
      await PoroductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return {
            categoryId: category,
            productId,
          };
        })
      );
    }
    res.status(201).send({ id: productId });
  } catch (error) {
    next(error);
  }
});
productRouter.get("/", async (req, res, next) => {
  try {
    console.log(req.query.price);
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    if (req.query.price)
      query.price = {
        ...query.price,
        [Op.gte]: req.query.price["min"],
      };
    if (req.query.price)
      query.price = {
        ...query.price,
        [Op.lte]: req.query.price["max"],
      };

    const response = await ProductModel.findAll({
      include: [
        {
          model: CategoriesModel,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      where: { ...query },
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const card = await ProductModel.findByPk(req.params.productId, {
      attributes: { exclude: ["id"] },
    });
    if (card) {
      res.send(card);
    } else {
      next(
        createHttpError(404, `Card with id ${req.params.productId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
productRouter.put("/:productId/category", async (req, res, next) => {
  try {
    const { id } = await PoroductsCategoriesModel.create({
      productId: req.params.productId,
      categoryId: req.body.categoryId,
    });
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});
productRouter.put("/:productId", async (req, res, next) => {
  try {
    const [line, response] = await ProductModel.update(req.body, {
      where: { id: req.params.productId },
      returning: true,
    });
    if (line === 1) {
      res.send(response[0]);
    } else {
      next(
        createHttpError(404, `Card with id ${req.params.productId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const response = await ProductModel.destroy({
      where: { id: req.params.productId },
    });

    if (response === 1) {
      res.status(204).send("Cars deleted successfully");
    } else {
      next(
        createHttpError(404, `Card with id ${req.params.productId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
