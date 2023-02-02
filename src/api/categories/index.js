import express from "express";
import CategoriesModel from "./model.js";
const categoryRouter = express.Router();

categoryRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoriesModel.create(req.body);
    res.status(201).send({ id: categoryId });
  } catch (error) {
    next(error);
  }
});
categoryRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll();
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

categoryRouter.post("/bulk", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.bulkCreate([
      { name: "Game" },
      { name: "House" },
      { name: "Beauty" },
      { name: "Sport" },
      { name: "School" },
      { name: "Clothes" },
    ]);
    res.send(categories.map((c) => c.categoryId));
  } catch (error) {
    next(error);
  }
});

export default categoryRouter;
