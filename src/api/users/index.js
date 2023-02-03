import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import UsersModel from "./model.js";
import ReviewsModel from "../reviews/model.js";
import CardItemModel from "../cards/model.js";
import ProductModel from "../products/model.js";
const userRouter = express.Router();

userRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await UsersModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});
userRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.firstName)
      query.firstName = { [Op.iLike]: `${req.query.firstName}%` };
    const users = await UsersModel.findAll({
      where: { ...query },
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});
userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt"] },
    });
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
userRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdateRows, updatedRecord] = await UsersModel.update(
      req.body,
      {
        where: { id: req.params.userId },
        returning: true,
      }
    );
    if (numberOfUpdateRows === 1) {
      res.send(updatedRecord[0]);
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
userRouter.delete("/", async (req, res, next) => {
  try {
    const numberOfUpdateRows = await UsersModel.destroy({
      where: { id: req.params.userId },
    });
    if (numberOfUpdateRows === 1) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId/reviews", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      include: {
        model: ReviewsModel,
        attributes: ["comment", "productId"],
      },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId/card", async (req, res, next) => {
  try {
    const card = await UsersModel.findByPk(req.params.userId, {
      include: [
        {
          model: CardItemModel,
          include: [
            {
              model: ProductModel,
              attributes: ["name"],
            },
          ],

          attributes: ["productProductId"],
        },
      ],
    });
    res.send(card);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId/cardItems", async (req, res, next) => {
  try {
    const card = await UsersModel.findByPk(req.params.userId, {
      include: {
        model: CardItemModel,
      },
    });
    res.send(card);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
