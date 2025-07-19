import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";
import { TourRoutes } from "../modules/tour/tour.route";

export const router = Router();

const modulesRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRouters
    },
    {
        path: "/division",
        route: DivisionRoutes
    },
    {
        path: "/tour",
        route: TourRoutes
    }, 
]


modulesRoutes.forEach((route) =>{
    router.use(route.path, route.route)
})


// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/booking", BookingRoutes)
