import style from "./Navbar.module.css";
import logo from "../../assets/whitelogo1.png";
import search from "../../assets/search.png";
import krestik from "../../assets/krestik.png";
import best from "../../assets/best.png";
import cooker from "../../assets/cooker.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [info, setInfo] = useState([]);
  const [isModal, setModal] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [allrecipes, setAllRecipes] = useState([]);
  const [resRecipes, setResRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5300/api/Recipe/getAllRecipe", {
        withCredentials: true,
      })
      .then((res) => {
        setAllRecipes(res.data);
      });
  }, []);
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
  function handleOpenModel() {
    setShowModalSearch(true);
    setResRecipes([]);
  }
  function handleCloseModal() {
    setShowModalSearch(false);
    setResRecipes([]);
  }
  function getModal() {
    setModal((prev) => !prev);
    console.log("asd");
  }
  function logoutAccount() {
    Cookies.remove("tasty-cookies");
    window.location.reload();
  }
  function getmyRecipes() {}
  function onSearchChanged(e) {
    const text = e.target.value.trim().toLowerCase();
    if (!text) {
      setResRecipes([]);
      return;
    }
    const results = allrecipes
      .filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(text)) ||
          r.ingridients.toLowerCase().includes(text)
      )
      .map((r) => ({
        id: r.id,
        photourl: r.resultImage,
        name: r.name,
        category:r.category,
        kitchen:r.kitchen,
      }));
    setResRecipes(results);
  }
  return (
    <header>
      <div className={style.center}>
        <div className={style.left}>
          <ul className={style.leftmenu}>
            <Link to="/main">
              <li>
                <img className={style.navlogo} src={logo} alt="Логотип" />
              </li>
            </Link>
            <li>
              <a href="" className={style.recipe}>
                Рецепты
              </a>
            </li>
            <li>
              <a href="">ЖУРНАЛ «ЕДА» №117 (179)</a>
            </li>
            <li>
              <a href="">Школа «еды»</a>
            </li>
            <li>
              <a href="">Идеи</a>
            </li>
            <li>
              <a href="">Авторы</a>
            </li>
            <li>
              <a href="">База</a>
            </li>
          </ul>
        </div>
        <div className={style.right}>
          <ul className={style.righmenu}>
            <li className={style.rightli}  onClick={handleOpenModel}>
              <div className={style.border}>
                <div className={style.container}>
                  <div className={style.search}>
                    <img src={search} alt="Поиск" />
                  </div>
                  <div className={style.phonehidden}>
                    <button >Поиск по сайту</button>
                  </div>
                </div>
              </div>
            </li>
            <li className={style.rightli}>
              <button className={style.container}>
                {user ? (
                  <>
                    {info ? (
                      <div className={style.enter} id={style.dropdown}>
                        <div className={style.dropbtn} onClick={getModal}>
                          <img src={info.avatarURL} alt="" />
                          <p>{info.login}</p>
                        </div>
                        {isModal && (
                          <div className={style.dropdowncontent}>
                            <Link to="/myrecipes">
                              <p className={style.getrecipes}>
                                Посмотреть свои рецепты
                              </p>
                            </Link>
                            <p className={style.logout} onClick={logoutAccount}>
                              Выйти
                            </p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className={style.enter}>
                    <Link to="/login">
                      <img src={cooker} alt="Повар" />
                      <p>Войти</p>
                    </Link>
                  </div>
                )}
              </button>
            </li>
            <li className={style.rightli}>
              <button className={style.container}>
                <div className={style.save}>
                  <img src={best} alt="Закладка" />
                </div>
                <Link to="/recipebook">
                  <div className={style.phonehidden}>
                    <p>Моя книга рецептов</p>
                  </div>
                </Link>
              </button>
            </li>
            <li>
              <Link to="/addrecipe">
                <button className={style.add}>Добавить рецепт</button>
              </Link>
            </li>
          </ul>
        </div>
        {showModalSearch && (
          <div className={style.modalBackdrop}>
            <div className={style.modal}>
              <div className={style.search}>
                <img src={logo} alt="Логотип" className={style.searchlogo} />
                <div className={style.strip}></div>
                <div className={style.stringsearch}>
                  <img src={search} alt="" />
                  <input
                    type="text"
                    placeholder="Поиск по рецептам,ингридиентам,статьям в журнале"
                    onChange={onSearchChanged}
                  />
                </div>
                <button className={style.closemodal} onClick={handleCloseModal}>
                  <img src={krestik} alt="" />
                </button>
              </div>
              <div className={style.recipes}>
                <div className={style.leftrecipes}></div>
                <div className={style.recipescenter}>
                  <p>Рецепты</p>
                  <div className={style.result}>
                    {resRecipes.length === 0 ? (
                      <p className={style.noResults}>
                        Ничего не нашли по вашему запросу
                      </p>
                    ) : (
                      resRecipes.map((item) => (
                        <Link
                          key={item.id}
                          to={`/recipe/${item.id}`}
                          className={style.searchResult}
                          onClick={() => setShowModalSearch(false)}
                        >
                          <img src={item.photourl} alt={item.name} />
                          <div className={style.searchright}>
                            <p className={style.recipecat}>{item.kitchen} • {item.category}</p>
                            <p className={style.recipename}>{item.name}</p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
