import NavBar from "../Navbar/Navbar";
import Selection from "../Selection/Selection";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "./RecipePage.module.css";
import pot from "../../assets/pot.png";
import time from "../../assets/stopwatch.png";
import best from "../../assets/best.png";
import arrow from "../../assets/arrow.png";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5300/api/Recipe/getRecipeById/${id}`)
      .then((res) => {
        setRecipe(res.data);
      });
  }, [id]);
  useEffect(() => {
    if (recipe) {
      axios
        .get(`http://localhost:5300/api/User/getById/${recipe.idUser}`)
        .then((res) => {
          setUser(res.data);
        });
    }
  }, [recipe]);
  useEffect(() => {
    if (user) {
      axios
        .get(
          `http://localhost:5300/api/Recipe/getCountRecipeByIdUser/${user.id}`
        )
        .then((res) => {
          setCount(res.data);
        });
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5300/api/Images/getAllByIdRecipe/${id}`)
        .then((res) => {
          setSteps(res.data);
        });
    }
  }, [user]);

  if (!recipe) {
    return (
      <div className={style.allLoader}>
        <div className={style.loader}></div>
      </div>
    );
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
        <div className={style.page}>
          <div className={style.center}>
            <div className={style.title}>
              <h1 className={style.firsth1}>{recipe.name}</h1>
              <div className={style.options}>
                <div className={style.portions}>
                  <img src={pot} className={style.pot} alt="кастрюля" />
                  <p className={style.p1}>{recipe.numberServings}</p>
                </div>
                <div className={style.portions}>
                  <img src={time} className={style.stopwatch} alt="часы" />
                  <p className={style.p2}>{formatCookingTime(recipe.time)}</p>
                </div>
                <div className={style.strip}></div>
                <div className={style.saves}>
                  <img className={style.best} src={best} alt="сохранить" />
                  <p>Добавить в книгу рецептов</p>
                  <p className={style.countsaves}>{recipe.saves}</p>
                  <img className={style.arrow} src={arrow} alt="" />
                </div>
                <div className={style.portions}>
                  <img className={style.like} src={like} alt="" />
                  <p className={style.countlikes}>{recipe.likes}</p>
                </div>
                <div className={style.portions}>
                  <img className={style.like} src={dislike} alt="" />
                  <p className={style.countlikes}>{recipe.likes}</p>
                </div>
              </div>
            </div>
            <div className={style.dishnameblock}>
              <div className={style.dishname}>
                <img src={recipe.resultImage} alt="" />
              </div>
            </div>
            <div className={style.description}>
              <div className={style.alldescription}>
                <fieldset className={style.author}>
                  <legend>Автор рецепта</legend>
                  <div className={style.centerauthor}>
                    {user && (
                      <div className={style.leftAvatar}>
                        <img src={user.avatarURL} alt="" />
                        <div className={style.userinfo}>
                          <p className={style.name}>
                            Автор: {user.firstName} {user.secondName}
                          </p>
                          <p className={style.countrecipe}>{count} рецепта</p>
                        </div>
                      </div>
                    )}
                    <div className={style.rightAvatar}>
                      <button>Подписаться</button>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className={style.recipehistory}>
                <p>{recipe.recipeHistory}</p>
              </div>
              <div className={style.calories}>
                <p className={style.caloriestitle}>
                  Энергетическая ценность на порцию
                </p>
                <div className={style.countcalories}>
                  <div className={style.option}>
                    <p className={style.optionname}>Калорийность</p>
                    <p className={style.numbercalories}>{recipe.calories}</p>
                    <p className={style.caloriesname}>Ккал</p>
                  </div>
                  <div className={style.option}>
                    <p className={style.optionname}>Белки</p>
                    <p className={style.numbercalories}>{recipe.proteins}</p>
                    <p className={style.caloriesname}>Грамм</p>
                  </div>
                  <div className={style.option}>
                    <p className={style.optionname}>Жиры</p>
                    <p className={style.numbercalories}>{recipe.fats}</p>
                    <p className={style.caloriesname}>Грамм</p>
                  </div>
                  <div className={style.option}>
                    <p className={style.optionname}>Углеводы</p>
                    <p className={style.numbercalories}>{recipe.carbs}</p>
                    <p className={style.caloriesname}>Грамм</p>
                  </div>
                </div>
              </div>
              <div className={style.ingridients}>
                <p className={style.ingridientstitle}>Ингредиенты</p>
                <div className={style.allingridients}>
                  {recipe.ingridients &&
                    recipe.ingridients.split(",").map((item, index) => {
                      const parts = item.trim().split(":");
                      const name = parts.slice(0, -1).join(" ");
                      const amount = parts[parts.length - 1];
                      return (
                        <div className={style.ingridient} key={index}>
                          <p className={style.ingridientname}>{name}</p>
                          <p className={style.ingridientstrip}></p>
                          <p className={style.ingridientgram}>{amount}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className={style.instruction}>
                <p className={style.ingridientstitle}>
                  Инструкция приготовления
                </p>
                {steps.map((step) => (
                  <div className={style.step} key={step.id}>
                    <img src={step.imageUrl} alt="фотография рецепта" />
                    <div className={style.stepformula}>
                      <p className={style.numberstep}>{step.numberStep}</p>
                      <p className={style.stepdescription}>
                        {step.stepFormula}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {recipe.recipeTip && (
                <div className={style.recipetip}>
                  <fieldset className={style.author}>
                    <legend>Совет к рецепту</legend>
                    <div className={style.centerrecipetip}>
                      {recipe.recipeTip}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
