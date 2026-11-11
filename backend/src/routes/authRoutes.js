import {Router} from "express"
import { asyncHandler} from "../utils/asyncHandler.js";
import {loginUser, registerUser} from "../controllers/authController.js"
import { verifyJWT } from "../middleware/authMiddleware.js";
import { apiResponse } from "../utils/apiResponse.js";

const router = Router();

router.post("/register",asyncHandler(registerUser));
router.post("/login",asyncHandler(loginUser));
// router.get("/me",asyncHandler(verifyJWT),(req,res)=>{
//     return res
//     .status(200)
//     .json(
//         new apiResponse(
//             200,
//            { user: req.user},
//            "me handler testing"
//         )
//     )
// });
export default router;