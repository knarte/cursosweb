import express from "express"

import {
getCourses,
createCourse,
updateCourse,
deleteCourse
} from "../controllers/course.controller.js"

import {protect} from "../middleware/auth.middleware.js"

const router=express.Router()

router.get("/courses",getCourses)

router.post("/courses",protect,createCourse)

router.put("/courses/:id",protect,updateCourse)

router.delete("/courses/:id",protect,deleteCourse)

export default router
