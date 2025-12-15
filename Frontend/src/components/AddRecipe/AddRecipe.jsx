import NavBar from "../Navbar/Navbar";
import Selection from "../Selection/Selection";
import style from "./AddRecipe.module.css";
import upload from "../../assets/uploadimage.png";
import plus from "../../assets/plus.png";
import minus from "../../assets/minus.png";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer.jsx";

export default function EditRecipe() {
  const [photo, setPhoto] = useState("");
  const [info, setInfo] = useState([]);
  const [user, setUser] = useState(null);
  const [resfile, setResFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const increasePortions = () => setPortions(portions + 1);
  const decreasePortions = () => {
    if (portions > 1) setPortions(portions - 1);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setResFile(e.target.files[0]);
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const [showHistory, setShowHistory] = useState(false);
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const [ingredients, setIngredients] = useState([
    { uid: Date.now(), text: "", count: 0, unit: "" },
    { uid: Date.now() + 1, text: "", count: 0, unit: "" },
  ]);
  const handleIngredientChange = (uid, field, value) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.uid === uid ? { ...ing, [field]: value } : ing))
    );
  };
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { uid: Date.now(), text: "", count: 0, unit: "" },
    ]);
  };
  const removeIngredient = (uid) => {
    if (ingredients.length > 2) {
      setIngredients(ingredients.filter((ing) => ing.uid !== uid));
    }
  };

  const [step, setStep] = useState([
    { uid: Date.now(), text: "", photopreview: "", photourl: null },
    { uid: Date.now() + 1, text: "", photopreview: "", photourl: null },
  ]);
  const handleStepChange = (uid, field, value) => {
    setStep((prev) =>
      prev.map((ing) => (ing.uid === uid ? { ...ing, [field]: value } : ing))
    );
  };
  const addStep = () => {
    setStep([
      ...step,
      { uid: Date.now(), text: "", photopreview: "", photourl: null },
    ]);
  };
  const removeStep = (uid) => {
    if (step.length > 2) {
      setStep(step.filter((step) => step.uid !== uid));
    }
  };
  const handleStepPhotoChange = (uid, file) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setStep((prev) =>
        prev.map((step) =>
          step.uid === uid ? { ...step, photopreview: preview } : step
        )
      );
      setStep((prev) =>
        prev.map((step) =>
          step.uid === uid ? { ...step, photourl: file } : step
        )
      );
    }
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
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5300/api/User/getById/" + user.userId, {
          withCredentials: true,
        })
        .then((res2) => {
          setInfo(res2.data);
        });
    }
  }, [user]);
  let time = "";
  let recipehistory = "";
  const [dishname, setDishname] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [portions, setPortions] = useState(1);
  const [category, setCategory] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [calories, setCalories] = useState(0);
  const [proteins, setProteins] = useState(0);
  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [recipetip, setRecipetip] = useState("");
  const [title, setHistoryTitle] = useState("");
  const [description, setHistoryDesc] = useState("");
  const [minutesMax, setMinutesMax] = useState(false);
  const [emptyCategory, setEmptyCategory] = useState(false);
  const [emptyKitchen, setEmptyKitchen] = useState(false);
  const [emptyStrings, setEmptyStrings] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMinutesMax(false);
    setEmptyCategory(false);
    setEmptyKitchen(false);
    setEmptyStrings(false);
    let hasError = false;
    if (minutes > 60 || minutes < 0) {
      setMinutesMax(true);
      hasError = true;
    }
    if (category == "") {
      setEmptyCategory(true);
      hasError = true;
    }
    if (kitchen == "") {
      setEmptyKitchen(true);
      hasError = true;
    }
    if (
      dishname == "" ||
      portions == "" ||
      ingredients[0].text == "" ||
      calories == ""
    ) {
      setEmptyStrings(true);
      hasError = true;
    }
    if (!hasError) {
      const ingredientsString = ingredients
        .map((ing) => `${ing.text}:${ing.count} ${ing.unit}`)
        .join(",");
      if (hours.trim() === "") {
        time = minutes;
      } else if (minutes.trim() === "") {
        time = hours;
      } else {
        time = hours + ":" + minutes;
      }
      recipehistory = title + "/" + description;
      const formData = new FormData();
      formData.append("name", dishname);
      formData.append("time", time);
      formData.append("numberservings", portions);
      formData.append("resultimage", resfile);
      formData.append("category", category);
      formData.append("kitchen", kitchen);
      formData.append("recipehistory", recipehistory);
      formData.append("ingridients", ingredientsString);
      formData.append("calories", calories);
      formData.append("proteins", proteins);
      formData.append("fats", fats);
      formData.append("carbs", carbs);
      formData.append("recipetip", recipetip);
      formData.append("idUser", info.id);
      try {
        const res = await axios.post(
          "http://localhost:5300/api/Recipe/createRecipe",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          const idRecipe = await axios.get(
            "http://localhost:5300/api/Recipe/getLastRecipeByIdUser/" + info.id,
            {
              withCredentials: true,
            }
          );
          for (let index = 0; index < step.length; index++) {
            const formData2 = new FormData();
            const element = step[index];
            formData2.append("idRecipe", idRecipe.data);
            formData2.append("idUser", info.id);
            formData2.append("numberStep", index + 1);
            formData2.append("stepFormula", element.text);
            formData2.append("imageUrl", element.photourl);
            formData2.append("imagePreview", element.photopreview);
            await axios.post(
              "http://localhost:5300/api/Images/createStep",
              formData2,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
              }
            );
          }
          setShowModal(true);
        }
      } catch {
        console.log("Ошибка в добавлении рецепта");
      }
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/main");
  };
  return (
    <div>
      <NavBar />
      <Selection />
      <main>
        <form onSubmit={handleSubmit}>
          <div className={style.page}>
            <div className={style.center}>
              <textarea
                name="name"
                placeholder="Название рецепта"
                autoComplete="on"
                className={style.namedish}
                value={dishname}
                onChange={(e) => setDishname(e.target.value)}
              ></textarea>
              <div className={style.allparameters}>
                <div className={style.parameters}>
                  <div>
                    <span className={style.title}>Кол-во порций</span>
                    <div className={style.count}>
                      <button type="button" onClick={decreasePortions}>
                        -
                      </button>
                      <div className={style.numbers}>
                        <input
                          placeholder=""
                          type="number"
                          name="portionsCount"
                          autoComplete="on"
                          inputMode="decimal"
                          step="1"
                          value={portions}
                          onChange={(e) => setPortions(Number(e.target.value))}
                        />
                      </div>
                      <button type="button" onClick={increasePortions}>
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className={style.title}>Время приготовления</span>
                    <div className={style.alltime}>
                      <div className={style.tim}>
                        <div className={style.hours}>
                          <div className={style.counthours}>
                            <input
                              placeholder=""
                              type="number"
                              name="input"
                              value={hours}
                              onChange={(e) => setHours(e.target.value)}
                            ></input>
                          </div>
                          <span>Час(ов)</span>
                          <div className={style.countminutes}>
                            <input
                              placeholder=""
                              type="number"
                              name="input"
                              value={minutes}
                              onChange={(e) => setMinutes(e.target.value)}
                            ></input>
                            <span>Минут</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.allcalories}>
                <div className={style.centercalories}>
                  <div className={style.caloriesoptions}>
                    <span className={style.title}>Всего калорий</span>
                    <div className={style.alltime}>
                      <div className={style.tim}>
                        <div className={style.hours}>
                          <div className={style.countcalories}>
                            <input
                              placeholder=""
                              type="number"
                              name="input"
                              value={calories}
                              onChange={(e) => setCalories(e.target.value)}
                            ></input>
                            <span>Калорий</span>
                          </div>
                          <div className={style.countcalories1}>
                            <input
                              placeholder=""
                              type="number"
                              name="input"
                              value={proteins}
                              onChange={(e) => setProteins(e.target.value)}
                            ></input>
                            <span>Белки</span>
                          </div>
                          <div className={style.countcalories1}>
                            <input
                              placeholder=""
                              type="number"
                              name="input"
                              value={fats}
                              onChange={(e) => setFats(e.target.value)}
                            ></input>
                            <span>Жиры</span>
                          </div>
                          <div className={style.countcalories1}>
                            <input
                              placeholder=""
                              type="number"
                              name="input"
                              value={carbs}
                              onChange={(e) => setCarbs(e.target.value)}
                            ></input>
                            <span>Углеводы</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.photo}>
                <span className={style.spanphoto}>Фото готового блюда</span>
                <div className={style.photoupload}>
                  <label className={style.labelphoto}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    <div className={style.all}>
                      {photo ? (
                        <img
                          src={photo}
                          alt="Предпросмотр"
                          className={style.resultimg}
                        />
                      ) : (
                        <div className={style.description}>
                          <img src={upload} alt="" />
                          <span className={style.addphoto}>
                            Добавить фото <br />
                            (Загрузить)
                          </span>
                          <span className={style.howdo}>
                            Перетащите фотографии сюда <br />
                            или нажмите на иконку
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <div className={style.allparameters}>
                <div className={style.centercategories}>
                  <div className={style.left}>
                    <span className={style.title}>Категория блюда</span>
                    <div>
                      <select
                        className={style.choice}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="value1">Выберите категорию</option>
                        <option value="Завтрак">Завтрак</option>
                        <option value="Обед">Обед</option>
                        <option value="Ужин">Ужин</option>
                        <option value="Другое">Другое</option>
                      </select>
                    </div>
                  </div>
                  <div className={style.right}>
                    <span className={style.title}>Национальная кухня</span>
                    <div className={style.kitchen}>
                      <select
                        className={style.choice}
                        value={kitchen}
                        onChange={(e) => setKitchen(e.target.value)}
                      >
                        <option value="value1">Выберите кухню</option>
                        <option value="Русская кухня">Русская кухня</option>
                        <option value="Итальянская кухня">
                          Итальянская кухня
                        </option>
                        <option value="Грузинская кухня">
                          Грузинская кухня
                        </option>
                        <option value="Другая кухня">Другая кухня</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.strip1}></div>
              <div className={style.allparameters}>
                <div className={style.centerhistory}>
                  <div className={style.history}>
                    <span>История к рецепту</span>
                    <p>
                      Расскажите о вашем рецепте больше, добавив к нему историю
                    </p>
                  </div>
                  <div className={style.historyItem}>
                    {showHistory && (
                      <div className={style.historytitle}>
                        <span>Название истории</span>
                        <div className={style.titleinput}>
                          <input
                            type="text"
                            placeholder="История к рецепту «…»"
                            value={title}
                            onChange={(e) => setHistoryTitle(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {showHistory && (
                      <div className={style.historytitle}>
                        <span>Описание истории</span>
                        <div className={style.titleinput}>
                          <textarea
                            type="text"
                            placeholder="Например, историю о том, как вам удалось узнать секрет настоящего узбекского плова, или о том, как вы лично изобрели новый способ приготовления яиц-пашот. "
                            value={description}
                            onChange={(e) => setHistoryDesc(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    className={style.historybutton}
                    onClick={toggleHistory}
                    type="button"
                  >
                    <div className={style.addhistory}>
                      {showHistory ? (
                        <>
                          <img src={minus} alt="" />
                          <span className={style.deletehistory}>
                            Удалить историю
                          </span>
                        </>
                      ) : (
                        <>
                          <img src={plus} alt="" />
                          <span className={style.addhistory}>
                            Добавить историю
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              <div className={style.strip1}></div>
              <div className={style.allhistory}>
                <div className={style.centerhistory}>
                  <div className={style.history}>
                    <span>Ингредиенты</span>
                    <p>
                      Укажите все ингредиенты, которые необходимы для
                      приготовления <br />и подачи данного блюда
                    </p>
                  </div>
                  <div className={style.ingridients}>
                    {ingredients.map((item) => (
                      <div key={item.uid} className={style.ingridient}>
                        <div className={style.leftinput}>
                          <input
                            type="text"
                            placeholder="Укажите ингредиент"
                            className={style.nameingredient}
                            value={item.text}
                            onChange={(e) =>
                              handleIngredientChange(
                                item.uid,
                                "text",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            className={style.countingredient}
                            value={item.count}
                            onChange={(e) =>
                              handleIngredientChange(
                                item.uid,
                                "count",
                                e.target.value
                              )
                            }
                          />
                          <div className={style.rightselect}>
                            <select
                              value={item.unit || ""}
                              onChange={(e) =>
                                handleIngredientChange(
                                  item.uid,
                                  "unit",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Ед.изм.</option>
                              <option value="г">г</option>
                              <option value="штука">штука</option>
                              <option value="кусок">кусок</option>
                              <option value="литр">литр</option>
                              <option value="мл">мл</option>
                              <option value="стакан">стакан</option>
                              <option value="столовая ложка">
                                столовая ложка
                              </option>
                              <option value="чайная ложка">чайная ложка</option>
                              <option value="по вкусу">по вкусу</option>
                            </select>
                          </div>
                        </div>
                        {ingredients.length > 2 && (
                          <button
                            type="button"
                            className={style.removeBtn}
                            onClick={() => removeIngredient(item.uid)}
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    className={style.historybutton}
                    onClick={addIngredient}
                    type="button"
                  >
                    <div className={style.addhistory}>
                      <img src={plus} alt="" />
                      <span>Добавить ингредиент</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className={style.strip1}></div>
              <div className={style.instruction}>
                <div className={style.centerinstruction}>
                  <div className={style.history}>
                    <span>Пошаговая инструкция</span>
                    <p>
                      Пошаговая иструкция поможет начинающим приготовить ваш
                      рецепт.
                      <br />
                      Мы рекомендуем разбивать рецепт минимум на 5 шагов
                    </p>
                  </div>
                  <div className={style.steps}>
                    {step.map((item, index) => (
                      <div key={item.uid} className={style.allstep}>
                        <div className={style.step}>
                          <div className={style.numeration}>
                            <span className={style.numberstep}>
                              Шаг {index + 1}
                            </span>
                            <span className={style.symbols}>0 / 5000</span>
                          </div>
                          <div className={style.stepinfo}>
                            <div className={style.leftstep}>
                              <div className={style.upload}>
                                <label className={style.photostep}>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleStepPhotoChange(
                                        item.uid,
                                        e.target.files[0]
                                      )
                                    }
                                  />
                                  <div className={style.stepdescription}>
                                    {item.photopreview ? (
                                      <img
                                        src={item.photopreview}
                                        alt="Фото шага"
                                        style={{
                                          maxWidth: "100%",
                                          height: "100%",
                                          marginTop: "-30px",
                                          borderRadius: "4px",
                                        }}
                                      />
                                    ) : (
                                      <div className={style.description}>
                                        <img src={upload} alt="" />
                                        <span className={style.addphoto}>
                                          Добавить <br />
                                          фото
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </label>
                              </div>
                            </div>
                            <div className={style.rightstep}>
                              <textarea
                                onChange={(e) =>
                                  handleStepChange(
                                    item.uid,
                                    "text",
                                    e.target.value
                                  )
                                }
                                placeholder="Инструкция к шагу приготовления"
                              />
                            </div>
                          </div>
                        </div>
                        {step.length > 2 && (
                          <button
                            type="button"
                            className={style.removeHistoryBtn}
                            onClick={() => removeStep(item.uid)}
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className={style.stepsbutton} type="button">
                    <div className={style.addsteps} onClick={addStep}>
                      <img src={plus} alt="" />
                      <span>Добавить шаг</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className={style.strip1}></div>
              <div className={style.advice}>
                <div className={style.centeradvice}>
                  <div className={style.history}>
                    <span>Совет к рецепту</span>
                  </div>
                  <div className={style.title}>
                    <span className={style.lefttitle}>Примечание</span>
                    <span className={style.righttitle}>0 / 5000</span>
                  </div>
                  <div className={style.descarea}>
                    <textarea
                      onChange={(e) => setRecipetip(e.target.value)}
                      value={recipetip}
                      placeholder="Используйте поле примечание для описания альтернативного способа приготовления блюда или вариантов замены ингредиентов"
                    ></textarea>
                  </div>
                  <div className={style.error}>
                    {minutesMax && (
                      <p className={style.error}>
                        ● Неправильный формат времени приготовления
                      </p>
                    )}
                    {emptyCategory && (
                      <p className={style.error}>● Выберите категорию</p>
                    )}
                    {emptyKitchen && (
                      <p className={style.error}>● Выберите кухню</p>
                    )}
                    {emptyStrings && (
                      <p className={style.error}>
                        ● Не все обязательные поля заполнены
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="submit"
                  value="Добавить рецепт"
                  className={style.addrecipe}
                />
              </div>
            </div>
          </div>
        </form>
        {showModal && (
          <div className={style.modalBackdrop}>
            <div className={style.modal}>
              <h2>Вы добавили рецепт</h2>
              <button onClick={handleCloseModal}>OK</button>
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}
