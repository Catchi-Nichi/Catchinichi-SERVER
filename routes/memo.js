const express = require("express");
const router = express.Router();
const MemoController = require("../controllers/memoController");

router.post("/addMemo", MemoController.addMemo); // 시향노트 등록
router.patch("/update/:id", MemoController.updateMemo); // 시향노트 수정
router.get("/delete/:id", MemoController.deleteMemo); // 시향노트 삭제
router.get("/loadAll/:nick", MemoController.loadAllMemo);
router.get("/load/:id", MemoController.loadOneMemo);
module.exports = router;
