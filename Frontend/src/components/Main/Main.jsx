import style from "./Main.module.css";
import logo from "../../assets/whitelogo2.png";
import arrow from "../../assets/arrow.png";
import pot from "../../assets/pot.png";
import stopwatch from "../../assets/stopwatch.png";
import best2 from "../../assets/best2.png";
import best from "../../assets/best.png";
import graybest from "../../assets/graybest.png";
import like from "../../assets/like.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer.jsx";
import Cookies from "js-cookie";

export default function Main() {
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
        setRecipes(res.data);
        setLength(res.data.length);
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
  return (
    <main>
      <div className={style.page}>
        <div className={style.centerpage}>
          <div className={style.title}>
            <h1 className={style.firsth1}>Рецепты</h1>
            <p className={style.titlep}>
              Ищите рецепты, выбирая категорию блюда, его подкатегорию, кухню
              или меню. А в дополнительных фильтрах можно искать по нужному (или
              ненужному) ингредиенту: просто начните писать его название и сайт
              подберет соответствующий.
            </p>
          </div>
          <div className={style.mainpage}>
            <p className={style.mainsearch}>Найдено {length} рецепта</p>
            {recipes.map((recipe) => (
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
                                  <p>{formatPortions(recipe.numberServings)}</p>
                                </div>
                              </div>
                              <ul className={style.ulingredientList}>
                                {recipe.ingridients &&
                                  recipe.ingridients
                                    .split(",")
                                    .map((item, index) => {
                                      const parts = item.trim().split(":");
                                      const name = parts.slice(0, -1).join(" ");
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
          <div className={style.modalBackdrop1}>
            <div className={style.modal1}>
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
  );
}
