import style from "./OptionsRecipe.module.css";
import logo from "../../assets/whitelogo2.png";
import arrow from "../../assets/arrow.png";
import pot from "../../assets/pot.png";
import stopwatch from "../../assets/stopwatch.png";
import best2 from "../../assets/best2.png";
import best from "../../assets/best.png";
import graybest from "../../assets/graybest.png";
import like from "../../assets/like.png";
import { useEffect, useState,useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer.jsx";
import Cookies from "js-cookie";
import NavBar from "../Navbar/Navbar";
import Selection from "../Selection/Selection";
import { useSearchParams } from "react-router-dom";

export default function OptionsRecipe() {
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get("difficulty");
  const time = searchParams.get("time");
  const kitchen = searchParams.get("kitchen");
  const category = searchParams.get("category");

  const [recipes, setRecipes] = useState([]);
  const [length, setLength] = useState(0);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const [openRecipeId, setOpenRecipeId] = useState(null);
  const toggleIngredients = (id) => {
    setOpenRecipeId(openRecipeId === id ? null : id);
  };

  const token = Cookies.get("tasty-cookies");
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5300/api/Auth/userInfo", {
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data);
        });
    }
  }, []);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (user) {
      axios
        .get(
          `http://localhost:5300/api/RecipeBook/getAllRecipeBookByIdUser/` +
            user.userId,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const ids = res.data.map((r) => r.idRecipe);
          setSavedRecipes(ids);
        })
        .catch((err) => {
          console.error("Ошибка при получении книги рецептов:", err);
        });
    }
  }, [user]);
  useEffect(() => {
    axios
      .get("http://localhost:5300/api/Recipe/getAllRecipe")
      .then((res) => {
        res.data.forEach((element) => {
            console.log(res.data)
          setRecipes(res.data);
        });
      })
      .catch((err) => {
        console.error("Ошибка при получении рецептов:", err);
      });
  }, []);
  function formatPortions(n) {
    if (n % 10 === 1 && n % 100 !== 11) return `${n} порция`;
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
      return `${n} порции`;
    return `${n} порций`;
  }
  async function toggleRecipeBook(id) {
    if (!user) {
      setShowModal(true);
      return;
    }
    try {
      if (savedRecipes.includes(id)) {
        await axios.delete(
          "http://localhost:5300/api/RecipeBook/removeToBookAsync",
          {
            data: {
              idRecipe: id,
              idUser: user.userId,
            },
            withCredentials: true,
          }
        );
        setSavedRecipes(savedRecipes.filter((rid) => rid !== id));
      } else {
        const formData = new FormData();
        formData.append("idRecipe", id);
        formData.append("idUser", user.userId);
        await axios.post(
          "http://localhost:5300/api/RecipeBook/addToBookAsync",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        setSavedRecipes([...savedRecipes, id]);
      }
    } catch (err) {
      console.error("Ошибка при изменении книги рецептов:", err);
    }
  }
  function formatCookingTime(timeStr) {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (hours === 0 && minutes > 0) {
      return `${minutes} минут`;
    }
    if (hours > 0 && minutes === 0) {
      return `${hours} ${hours === 1 ? "час" : "часа"}`;
    }
    if (hours > 0 && minutes > 0) {
      return `${hours} ${hours === 1 ? "час" : "часа"} ${minutes} минут`;
    }
    return "0 минут";
  }
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      if (kitchen && kitchen !== "value1" && recipe.kitchen !== kitchen) {
        return false;
      }
      if (category && category !== "value1" && recipe.category !== category) {
        return false;
      }
      if (difficulty && difficulty !== "value1") {
        let recipeTotalMinutes = 0;
        if (recipe.time?.includes(":")) {
          const [h, m] = recipe.time.split(":").map(Number);
          recipeTotalMinutes = (h || 0) * 60 + (m || 0);
        } else {
          recipeTotalMinutes = parseInt(recipe.time) || 0;
        }
        let totalIngredients=recipe.ingridients.split(",")
        if(difficulty=="Новичок"){
            if(recipeTotalMinutes<=40 &&totalIngredients.length<=4){
                return true;
            }
        }
        if(difficulty=="Обычная"){
            if(recipeTotalMinutes<=70 &&totalIngredients.length<=6){
                return true;
            }
        }
        if(difficulty=="Профи"){
            if(recipeTotalMinutes>=70 &&totalIngredients.length>=6){
                return true;
            }
        }
        return false;
      }
      if (time && time !== "value1") {
        let recipeTotalMinutes = 0;
        if (recipe.time?.includes(":")) {
          const [h, m] = recipe.time.split(":").map(Number);
          recipeTotalMinutes = (h || 0) * 60 + (m || 0);
        } else {
          recipeTotalMinutes = parseInt(recipe.time) || 0;
        }
        if (time === "30") {
          if (recipeTotalMinutes > 30) return false;
        } else if (time === "меньше 1") {
          if (recipeTotalMinutes >= 60) return false;
        } else if (time === "больше 1") {
          if (recipeTotalMinutes <= 60) return false;
        }
      }
      return true;
    });
  }, [recipes, difficulty, time, kitchen, category]);
  return (
    <div>
      <NavBar />
      <Selection />
      <main>
        <div className={style.page}>
          <div className={style.centerpage}>
            <div className={style.title}>
              <h1 className={style.firsth1}>Подобранные рецепты</h1>
              <p className={style.titlep}>
                Блюда, удовлетворяющие вашим запросам
              </p>
            </div>
            <div className={style.mainpage}>
              <p className={style.mainsearch}>Найдено {filteredRecipes.length} рецептов</p>
              {filteredRecipes.map((recipe) => (
                <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                  <div className={style.recipe} key={recipe.id}>
                    <div className={style.left3}>
                      <img src={recipe.resultImage} alt={recipe.name} />
                    </div>
                    <div className={style.right3}>
                      <div className={style.top}>
                        <p className={style.category}>{recipe.category}</p>
                        <p className={style.dot}>•</p>
                        <p className={style.kitchen}>{recipe.kitchen}</p>
                      </div>
                      <img src={logo} className={style.logo} alt="логотип" />
                      <p className={style.dishname}>{recipe.name}</p>
                      <p className={style.author}>Автор: Сергей Шаляпин</p>
                      <div className={style.middle}>
                        <div className={style.topmiddle}>
                          <button
                            className={style.mainingridients}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleIngredients(recipe.id);
                            }}
                          >
                            <p>
                              {recipe.ingridients
                                ? recipe.ingridients.split(",").length
                                : 0}{" "}
                              ингредиентов
                            </p>
                            <img src={arrow} alt="стрелка" />
                          </button>
                          {openRecipeId === recipe.id && (
                            <div className={style.ingredientsList}>
                              <div className={style.centeringredientsList}>
                                <div className={style.topingredientsList}>
                                  <div className={style.leftingridient}>
                                    <p>
                                      <b>Ингредиенты</b>
                                    </p>
                                  </div>
                                  <div className={style.rightingridient}>
                                    <p>
                                      {formatPortions(recipe.numberServings)}
                                    </p>
                                  </div>
                                </div>
                                <ul className={style.ulingredientList}>
                                  {recipe.ingridients &&
                                    recipe.ingridients
                                      .split(",")
                                      .map((item, index) => {
                                        const parts = item.trim().split(":");
                                        const name = parts
                                          .slice(0, -1)
                                          .join(" ");
                                        const amount = parts[parts.length - 1];
                                        return (
                                          <div
                                            className={style.ingridient}
                                            key={index}
                                          >
                                            <p className={style.ingridientname}>
                                              {name}
                                            </p>
                                            <p
                                              className={style.ingridientstrip}
                                            ></p>
                                            <p className={style.ingridientgram}>
                                              {amount}
                                            </p>
                                          </div>
                                        );
                                      })}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={style.stripcontainer}>
                          <p className={style.strip}>|</p>
                        </div>
                        <div className={style.rightmiddle}>
                          <div className={style.info}>
                            <div className={style.leftinfo}>
                              <img
                                src={pot}
                                className={style.pot}
                                alt="кастрюля"
                              />
                            </div>
                            <div className={style.righinfo}>
                              <p>{formatPortions(recipe.numberServings)}</p>
                            </div>
                          </div>
                          <div className={style.info}>
                            <div className={style.leftinfo}>
                              <img
                                src={stopwatch}
                                className={style.stopwatch}
                                alt="секундомер"
                              />
                            </div>
                            <div className={style.righinfo}>
                              <p>{formatCookingTime(recipe.time)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={style.bottom}>
                        <div className={style.bot}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleRecipeBook(recipe.id);
                            }}
                          >
                            <img
                              src={
                                savedRecipes.includes(recipe.id) ? best : best2
                              }
                              alt="флаг сохранения"
                            />
                            <p>
                              {savedRecipes.includes(recipe.id)
                                ? "Убрать из книги рецептов"
                                : "Добавить в книгу рецептов"}
                            </p>
                          </button>
                        </div>
                        <div className={style.about}>
                          <div className={style.other}>
                            <div className={style.otherimg}>
                              <img src={graybest} alt="" />
                            </div>
                            <div className={style.count}>
                              <p>{recipe.saves}</p>
                            </div>
                          </div>
                          <div className={style.other}>
                            <div className={style.otherimg}>
                              <img src={like} alt="" />
                            </div>
                            <div className={style.count}>
                              <p>{recipe.likes}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {showModal && (
            <div className={style.modalBackdrop}>
              <div className={style.modal}>
                <h2>
                  Для добавления в книгу рецептов зарегистрируйтесь на сайте
                </h2>
                <button onClick={handleCloseModal}>OK</button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}
