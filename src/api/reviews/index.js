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

export default reviewsRouter;
