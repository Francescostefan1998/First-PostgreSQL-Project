import express from "express";
import createHttpError from "http-errors";
import CardModel from "./model.js";

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
    const response = await CardModel.findAll();
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
