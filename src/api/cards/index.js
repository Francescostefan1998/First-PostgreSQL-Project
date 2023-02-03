import express from "express";
import createHttpError from "http-errors";
import ProductModel from "../products/model.js";
import CardItemModel from "./model.js";
import { Op } from "sequelize";
import UsersModel from "../users/model.js";

const cardItemRouter = express.Router();

cardItemRouter.post("/", async (req, res, next) => {
  try {
    const { cardItemId } = await CardItemModel.create(req.body);
    res.status(201).send({ cardItemId: cardItemId });
  } catch (error) {
    next(error);
  }
});
cardItemRouter.get("/", async (req, res, next) => {
  try {
    const cardItems = await CardItemModel.findAll({
      include: [
        {
          model: ProductModel,
          attributes: ["name"],
        },
        {
          model: UsersModel,
          attributes: ["firstName"],
        },
      ],
    });
    res.send(cardItems);
  } catch (error) {
    next(error);
  }
});

cardItemRouter.get("/:cardItemId", async (req, res, next) => {
  try {
    const cardItem = await CardItemModel.findByPk(
      req.params.cardItemId,

      {
        include: [
          {
            model: ProductModel,
            attributes: ["name"],
          },
          {
            model: UsersModel,
            attributes: ["firstName"],
          },
        ],
      }
    );
    res.send(cardItem);
  } catch (error) {
    next(error);
  }
});

cardItemRouter.delete("/:cardItemId", async (req, res, next) => {
  try {
    const cardItem = await CardItemModel.destroy({
      where: { cardItemId: req.params.cardItemId },
    });
    if (cardItem === 1) {
      res.status(204).send("Card item deleted succesfully");
    } else {
      next(
        createHttpError(
          404,
          `cardItem with id ${req.params.cardItemId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default cardItemRouter;
