import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./model.js";
import { Op } from "sequelize";
const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const response = await ProductModel.create(req.body);
    res.status(201).send({ response });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    if (req.query.price) query.price = { [Op.lt]: req.query.price };
    if (req.query.price) query.price = { [Op.gt]: req.query.price };

    const response = await ProductModel.findAll({ where: { ...query } });
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
