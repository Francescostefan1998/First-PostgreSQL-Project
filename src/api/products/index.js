import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./model.js";
import { Op } from "sequelize";
import CategoriesModel from "../categories/model.js";
import PoroductsCategoriesModel from "./productsCategoryModel.js";
import ReviewsModel from "../reviews/model.js";
import CardItemModel from "../cards/model.js";
import UsersModel from "../users/model.js";
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

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    if (req.query.categories) {
      const items = await ProductModel.findAll({
        include: [
          {
            model: CategoriesModel,
            attributes: ["name", "categoryId"],
            through: { attributes: [] },
            where: {
              name: {
                [Op.iLike]: `%${req.query.categories}%`,
              },
            },
          },
        ],
        where: { ...query },
        limit: limit,
        offset: offset,
      });
      const totalItems = await ProductModel.count({
        include: [
          {
            model: CategoriesModel,
            attributes: ["name", "categoryId"],
            through: { attributes: [] },
            where: {
              name: {
                [Op.iLike]: `%${req.query.categories}%`,
              },
            },
          },
        ],
        where: { ...query },
      });
      const totalPages = Math.ceil(totalItems / limit);
      const response = {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limit,
        page: offset + 1,

        products: items,
      };
      res.send(response);
    } else {
      const items = await ProductModel.findAll({
        include: [
          {
            model: CategoriesModel,
            attributes: ["name", "categoryId"],
            through: { attributes: [] },
          },
        ],
        where: { ...query },
        limit: limit,
        offset: offset,
      });
      const totalItems = await ProductModel.count({
        include: [
          {
            model: CategoriesModel,
            attributes: ["name", "categoryId"],
            through: { attributes: [] },
          },
        ],
        where: { ...query },
      });

      const totalPages = Math.ceil(totalItems / limit);

      const response = {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limit,
        page: offset + 1,

        products: items,
      };
      res.send(response);
    }
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
productRouter.get("/:productId/cardAdded", async (req, res, next) => {
  try {
    const card = await ProductModel.findByPk(req.params.productId, {
      include: [
        {
          model: CardItemModel,
          include: [
            {
              model: UsersModel,
              attributes: ["firstName"],
            },
          ],

          attributes: ["userId"],
        },
      ],
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

productRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const user = await ProductModel.findByPk(req.params.productId, {
      include: {
        model: ReviewsModel,
        attributes: ["comment"],
      },
    });
    res.send(user);
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
productRouter.delete(
  "/:productId/category/:categoryName",
  async (req, res, next) => {
    try {
      const category = await CategoriesModel.findOne({
        where: { name: req.params.categoryName },
      });
      const response = await PoroductsCategoriesModel.destroy({
        where: {
          productId: req.params.productId,
          categoryId: category.categoryId,
        },
      });

      res.status(201).send("category successfully removed");
    } catch (error) {
      next(error);
    }
  }
);
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
      res.status(204).send("Product deleted successfully");
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
