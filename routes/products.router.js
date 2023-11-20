const express = require("express"); // express라이브러리를 express 변수에 할당
const router = express.Router(); // 다시 express.Router()라는 함수를 실행시켜 router이라는 변수에 할당

const Product = require("../schemas/products.schema.js");

// 상품 등록
router.post("/products", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    //TODO: 아래 4 요소 유효성 검사
    const { title, content, author, password } = req.body;

    const newProducts = new Product({
      title,
      content,
      author,
      password
    });
    await newProducts.save();
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    res.status(500).json({ message: "예기치 못한 오류가 발생하였습니다." });
    //TODO: 에러 로깅
  }
});

// 상품 목록 조회
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .select("_id title author status createdAt")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "예기치 못한 오류가 발생하였습니다." });
    //TODO: 에러 로깅
  }
});

// 상품 상세 조회
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "_id title content author status createdAt"
    );

    if (!product) {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "예기치 못한 오류가 발생하였습니다." });
    //TODO: 에러 로깅
  }
});

// 상품 정보 수정
router.put("/products/:productId", async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    //TODO: 아래 4 요소 유효성 검사
    const { title, content, password, status } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }

    if (password !== product.password) {
      return res.status(401).json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    }

    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    res.json({ message: "상품 정보를 수정하였습니다." });
  } catch (error) {
    res.status(500).json({ message: "예기치 못한 오류가 발생하였습니다." });
    //TODO: 에러 로깅
  }
});

// 상품 삭제
router.delete("/products/:productId", async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const productId = req.params.productId;
    const { password } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }

    if (password !== product.password) {
      return res.status(401).json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    }

    await product.deleteOne({ id: productId });
    res.json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    res.status(500).json({ message: "예기치 못한 오류가 발생하였습니다." });
    //TODO: 에러 로깅
  }
});

module.exports = router;
