const express = require("express");
const router = express.Router();

const Product = require("../models/product.model");
const authenticate = require("../middlewares/authenticate");
const authorise = require("../middlewares/authorise");

router.post(
  "/",
  authenticate,
  authorise(["admin", "seller"]),
  async (req, res) => {
    try {
      const user = req.user;
      // console.log(user)
      const product = await Product.create({ ...req.body,  });
      return res.status(201).json({ product });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);



router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name")
      .lean()
      .exec();
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Public - products with filters



router.get("/filters", async (req, res) => {
  try {
    const name = req.query.name || "";
    const category = req.query.category || "";
    const price = req.query.price || "";
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (name) {
      query.name = {
        $regex: name,
        $options: "i",
      };
    }

    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }

    if (price) {
      query.price = {
        $lte: price,
      };
    }

    const products = await Product.find(query)
      .populate("seller", "name")
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      products,
      page,
      limit,
      total: products.length,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put(
  "/:id",
  authenticate,
  authorise(["seller", "admin"]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .lean()
        .exec();
      return res.status(200).json({ product });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  authorise(["admin", "seller"]),
  async (req, res) => {
    try {
      const { id: _id } = req.params;
      const product = await Product.findOneAndDelete({ _id });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
