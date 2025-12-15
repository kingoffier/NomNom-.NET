import { ADD_RECIPE, MAIN_PAGE } from "./utils/consts.js"
import AddRecipe from "./components/AddRecipe/AddRecipe.jsx"
import Selection from "./components/Selection/Selection.jsx"

export const publicRoutes=[
    {
        path:MAIN_PAGE,
        Component: Selection
    }
]
export const privateRoutes=[
    {
        path:ADD_RECIPE,
        Component: AddRecipe
    }
]