import express from "express";
import createHttpError from "http-errors";
import CardModel from "./model.js";
import { Op } from "sequelize";
const cardRouter = express.Router();

cardRouter.post("/", async (req, res, next) => {
  try {
    const response = await CardModel.create(req.body);
    res.status(201).send({ response });
  } catch (error) {
    next(error);
  }
});

cardRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    if (req.query.price) query.price = { [Op.lt]: `${req.query.price}` };
    const response = await CardModel.findAll({ where: { ...query } });
    res.send(response);
  } catch (error) {
    next(error);
  }
});
cardRouter.get("/:cardId", async (req, res, next) => {
  try {
    const card = await CardModel.findByPk(req.params.cardId, {
      attributes: { exclude: ["id"] },
    });
    if (card) {
      res.send(card);
    } else {
      next(createHttpError(404, `Card with id ${req.params.cardId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
cardRouter.put("/:cardId", async (req, res, next) => {
  try {
    const [line, response] = await CardModel.update(req.body, {
      where: { id: req.params.cardId },
      returning: true,
    });
    if (line === 1) {
      res.send(response[0]);
    } else {
      next(createHttpError(404, `Card with id ${req.params.cardId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
cardRouter.delete("/:cardId", async (req, res, next) => {
  try {
    const response = await CardModel.destroy({
      where: { id: req.params.cardId },
    });

    if (response === 1) {
      res.status(204).send("Cars deleted successfully");
    } else {
      next(createHttpError(404, `Card with id ${req.params.cardId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default cardRouter;
