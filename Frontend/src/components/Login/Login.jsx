import style from "./Login.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("login", login);
      formData.append("password", password);
      const res = await axios.post(
        "http://localhost:5300/api/Auth/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        navigate("/main");
      }
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className={style.all}>
      <form className={style.regForm} onSubmit={handleSubmit}>
        <header className={style.formheader}>
          <h1>Войти в аккаунт</h1>
        </header>
        <section className={style.formfield}>
          <div className={style.left}>
            <div className={style.pice}>
              <label>Логин</label>
            </div>
          </div>
          <div className={style.right}>
            <input
              type="text"
              name="login"
              placeholder="Введите логин"
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
        </section>
        <section className={style.formfield}>
          <div className={style.left}>
            <div className={style.pice}>
              <label>Пароль</label>
            </div>
          </div>
          <div className={style.right}>
            <input
              type="password"
              name="password"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
            {showError && (
              <p className={style.error}>Неправильный логин или пароль</p>
            )}
          </div>
        </section>
        <button>Войти</button>
        <div className={style.loginin}>
          <p>Ещё нет аккаунта?</p>
          <Link to="/registration">
            <a>Зарегистрироваться</a>
          </Link>
        </div>
      </form>
    </div>
  );
}
