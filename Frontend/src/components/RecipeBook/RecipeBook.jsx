import style from "./RecipeBook.module.css";
import NavBar from "../Navbar/Navbar";
import Selection from "../Selection/Selection";
import Footer from "../Footer/Footer";
import arrowUp from "../../assets/arrow.png";
import arrowDown from "../../assets/arrowDown.png";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/whitelogo2.png";
import pot from "../../assets/pot.png";
import stopwatch from "../../assets/stopwatch.png";
import best2 from "../../assets/best2.png";
import graybest from "../../assets/graybest.png";
import like from "../../assets/like.png";
import best from "../../assets/best.png";

export default function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [count, setCount] = useState([]);
  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    type: null,
    direction: "asc",
  });

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

  useEffect(() => {
    if (user) {
      axios
        .get(
          "http://localhost:5300/api/RecipeBook/getAllRecipeBookByIdUser/" +
            user.userId
        )
        .then((res) => {
          setCount(res.data);
        })
        .catch((err) => {
          console.error("Ошибка при получении рецептов:", err);
        });
    }
  }, [user]);
  useEffect(() => {
    if (count) {
      for (let index = 0; index < count.length; index++) {
        axios
          .get(
            "http://localhost:5300/api/Recipe/getRecipeById/" +
              count[index].idRecipe
          )
          .then((res) => {
            setRecipes((prev) => {
              if (prev.some((r) => r.id === res.data.id)) {
                return prev;
              }
              return [...prev, res.data];
            });
          })
          .catch((err) => console.error("Ошибка загрузки рецепта:", err));
      }
    }
  }, [count]);

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
  const handleSort = (type) => {
    if (sortConfig.type === type) {
      setSortConfig((prev) => ({
        type,
        direction: prev.direction === "asc" ? "desc" : "asc",
      }));
    } else {
      setSortConfig({ type, direction: "asc" });
    }
  };
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (!sortConfig.type) return 0;
    let valueA, valueB;
    switch (sortConfig.type) {
      case "popularity":
        valueA = a.saves;
        valueB = b.saves;
        break;
      case "date":
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
      case "time":
        const [hA, mA] = a.time.split(":").map(Number);
        const [hB, mB] = b.time.split(":").map(Number);
        valueA = hA * 60 + mA;
        valueB = hB * 60 + mB;
        break;
      default:
        return 0;
    }
    return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
  });
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const toggleIngredients = (id) => {
    setOpenRecipeId(openRecipeId === id ? null : id);
  };
  function formatPortions(n) {
    if (n % 10 === 1 && n % 100 !== 11) return `${n} порция`;
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
      return `${n} порции`;
    return `${n} порций`;
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
  return (
    <div>
      <NavBar />
      <Selection />
      <main>
        <div>
          <div className={style.page}>
            <div className={style.centerpage}>
              <div className={style.title}>
                <h1 className={style.firsth1}>Моя книга рецептов</h1>
                <p className={style.titlep}>То, что я люблю</p>
              </div>
              <div className={style.allcategory}>
                <div className={style.strip1}></div>
                <div className={style.allfilter}>
                  <div className={style.filter}>
                    <div className={style.leftfilter}>
                      <p>Сортировать:</p>
                    </div>
                    <div className={style.rightfilter}>
                      <div
                        className={`${style.namefilter} ${
                          sortConfig.type === "popularity"
                            ? style.active
                            : style.inactive
                        }`}
                        onClick={() => handleSort("popularity")}
                      >
                        <p>по популярности</p>
                        {sortConfig.type === "popularity" && (
                          <img
                            src={
                              sortConfig.direction === "asc"
                                ? arrowUp
                                : arrowDown
                            }
                            alt="стрелка"
                          />
                        )}
                      </div>
                      <div
                        className={`${style.namefilter} ${
                          sortConfig.type === "date"
                            ? style.active
                            : style.inactive
                        }`}
                        onClick={() => handleSort("date")}
                      >
                        <p>по дате добавления</p>
                        {sortConfig.type === "date" && (
                          <img
                            src={
                              sortConfig.direction === "asc"
                                ? arrowUp
                                : arrowDown
                            }
                            alt="стрелка"
                          />
                        )}
                      </div>
                      <div
                        className={`${style.namefilter} ${
                          sortConfig.type === "time"
                            ? style.active
                            : style.inactive
                        }`}
                        onClick={() => handleSort("time")}
                      >
                        <p>по времени приготовления</p>
                        {sortConfig.type === "time" && (
                          <img
                            src={
                              sortConfig.direction === "asc"
                                ? arrowUp
                                : arrowDown
                            }
                            alt="стрелка"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.allrecipes}>
                {sortedRecipes.map((recipe) => (
                  <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
                    <div className={style.recipe}>
                      <div className={style.left}>
                        <img src={recipe.resultImage} alt={recipe.name} />
                      </div>
                      <div className={style.right}>
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
                                ингридиентов
                              </p>
                              <img src={arrowUp} alt="стрелка" />
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
                                          const amount =
                                            parts[parts.length - 1];
                                          return (
                                            <div
                                              className={style.ingridient}
                                              key={index}
                                            >
                                              <p
                                                className={style.ingridientname}
                                              >
                                                {name}
                                              </p>
                                              <p
                                                className={
                                                  style.ingridientstrip
                                                }
                                              ></p>
                                              <p
                                                className={style.ingridientgram}
                                              >
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
                          <p className={style.strip}>|</p>
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
                                  savedRecipes.includes(recipe.id)
                                    ? best
                                    : best2
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
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
