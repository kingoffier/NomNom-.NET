import style from "./Selection.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Selection() {
  const navigate = useNavigate();
  let [kitchen, setKitchen] = useState("");
  let [time, setTime] = useState("");
  let [difficulty, setDifficulty] = useState("");
  let [category, setCategory] = useState("");
  function checkParameters() {
    const params = new URLSearchParams({
      difficulty,
      time,
      kitchen,
      category,
    });
    navigate(`/optionrecipes?${params.toString()}`);
  }
  return (
    <div>
      <fieldset>
        <legend>Подбор рецептов</legend>
        <div className={style.center}>
          <div className={style.left}>
            <select
              className={style.first}
              value={kitchen}
              onChange={(e) => setKitchen(e.target.value)}
            >
              <option value="value1">Любая кухня</option>
              <option value="Русская кухня">Русская кухня</option>
              <option value="Итальянская кухня">Итальянская кухня</option>
              <option value="Грузинская кухня">Грузинская кухня</option>
              <option value="Американская кухня">Американская кухня</option>
              <option value="Французская кухня">Французская кухня</option>
            </select>
            <select
              className={style.second}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="value1">Время приготовления</option>
              <option value="30">&lt; 30 минут</option>
              <option value="меньше 1">&lt; 1 часа</option>
              <option value="больше 1">&gt; 1 часа</option>
            </select>
            <select
              className={style.third}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="value1">Сложность готовки</option>
              <option value="Новичок">Новичок</option>
              <option value="Обычная">Обычная</option>
              <option value="Профи">Профи</option>
            </select>
            <select
              className={style.forth}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="value1">Прием пищи</option>
              <option value="Завтрак">Завтрак</option>
              <option value="Обед">Обед</option>
              <option value="Ужин">Ужин</option>
            </select>
          </div>
          <div className={style.right}>
            <button className={style.pickup} onClick={checkParameters}>
              Подобрать рецепты
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
