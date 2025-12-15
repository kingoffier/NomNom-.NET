import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./components/Login/Login.jsx";
import Registration from "./components/Registration/Registration.jsx";
import "./index.css";
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import AddRecipe from './components/AddRecipe/AddRecipe.jsx';
import RecipePage from './components/RecipePage/RecipePage.jsx';
import RecipeBook from './components/RecipeBook/RecipeBook.jsx';
import MyRecipes from './components/MyRecipes/MyRecipes.jsx';
import EditRecipe from './components/EditRecipe/EditRecipe.jsx';
import OptionRecipe from './components/OptionsRecipe/OptionsRecipe.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement:<div>Not Found</div>
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/registration",
    element: <Registration/>,
  },
  {
    path: "/main",
    element: <App/>,
  },
  {
    path: "/addrecipe",
    element: <AddRecipe/>,
  },
  {
    path:"/recipe/:id",
    element:<RecipePage/>
  },
  {
    path:"/recipebook",
    element:<RecipeBook/>
  },
  {
    path:"/myrecipes",
    element:<MyRecipes/>
  },
  {
    path:"/editrecipe/:id",
    element:<EditRecipe/>
  },
  {
    path:"/optionrecipes",
    element:<OptionRecipe/>
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
