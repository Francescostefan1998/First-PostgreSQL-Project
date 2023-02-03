import express from "express";
import ReviewsModel from "./model.js";
import UsersModel from "../users/model.js";
import CategoriesModel from "../categories/model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { reviewId } = await ReviewsModel.create(req.body);

    res.status(201).send({ id: reviewId });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.findAll({
      include: [
        { model: UsersModel, attributes: ["firstName", "lastName"] },

        // to exclude from the result the junction table rows --> through: { attributes: [] }
      ],
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const card = await ReviewsModel.findByPk(req.params.reviewId);
    if (card) {
      res.send(card);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const [line, response] = await ReviewsModel.update(req.body, {
      where: { reviewId: req.params.reviewId },
      returning: true,
    });
    if (line === 1) {
      res.send(response[0]);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewsModel.destroy({
      where: { reviewId: req.params.reviewId },
    });
    if (review === 1) {
      res.status(204).send("review successfully deleted");
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
