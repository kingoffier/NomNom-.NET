import style from "./Registration.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [showModal, setShowModal] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [secondname, setSecondname] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [showMinError, setShowMinError] = useState(false);
  const [secondnameMin, setsecondnameShowMin] = useState(false);
  const [showMaxError, setShowMaxError] = useState(false);
  const [secondnameMax, setsecondnameShowMax] = useState(false);
  const [showLoginMinError, setShowLoginMinError] = useState(false);
  const [showLoginMaxError, setShowLoginMaxError] = useState(false);
  const [showLoginEngError, setShowLoginEngError] = useState(false);
  const [showPasswordMinError, setPasswordMinError] = useState(false);
  const [showPasswordMaxError, setPasswordMaxError] = useState(false);
  const [showPasswordEngError, setPasswordEngError] = useState(false);
  const [showEmptyFirstname, setEmptyFirstname] = useState(false);
  const [showEmptyLogin, setEmptyLogin] = useState(false);
  const [showEmptyEmail, setEmptyEmail] = useState(false);
  const [showEmptyPassword, setEmptyPassword] = useState(false);
  const [showEmptyAvatar, setEmptyAvatar] = useState(false);
  const [showLoginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowMinError(false);
    setsecondnameShowMin(false);
    setsecondnameShowMax(false);
    setShowMaxError(false);
    setShowLoginMinError(false);
    setShowLoginMaxError(false);
    let hasError = false;
    if (firstname.length < 3) {
      setShowMinError(true);
      hasError = true;
    }
    if (firstname.length > 50) {
      setShowMaxError(true);
      hasError = true;
    }
    if (secondname.length < 3) {
      setsecondnameShowMin(true);
      hasError = true;
    }
    if (secondname.length > 50) {
      setsecondnameShowMax(true);
      hasError = true;
    }
    if (login.length < 3) {
      setShowLoginMinError(true);
      hasError = true;
    }
    if (login.length > 50) {
      setShowLoginMaxError(true);
      hasError = true;
    }
    if (/^[A-Za-z]+$/.test(login) == false) {
      setShowLoginEngError(true);
      hasError = true;
    }
    if (password.length < 3) {
      setPasswordMinError(true);
      hasError = true;
    }
    if (password.length > 50) {
      setPasswordMaxError(true);
      hasError = true;
    }
    if (/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/.test(password) == false) {
      setPasswordEngError(true);
      hasError = true;
    }
    if (firstname.trim() === "") {
      setEmptyFirstname(true);
      hasError = true;
    }
    if (login.trim() === "") {
      setEmptyLogin(true);
      hasError = true;
    }
    if (email.trim() === "") {
      setEmptyEmail(true);
      hasError = true;
    }
    if (password.trim() === "") {
      setEmptyPassword(true);
      hasError = true;
    }
    if (avatar === null) {
      setEmptyAvatar(true);
      hasError = true;
    }
    if (!hasError) {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("secondname", secondname);
      formData.append("email", email);
      formData.append("login", login);
      formData.append("avatar", avatar);
      formData.append("password", password);
      try {
        const res = await axios.post(
          "http://localhost:5300/api/Auth/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        console.log("Регистрация успешна", res.data);
        if (res.status === 200) {
          setShowModal(true);
        }
      } catch (err) {
        if (
          err.response.data.message ===
          "Пользователь с таким логином уже существует"
        ) {
          setLoginError(true);
        }
      }
      hasError = false;
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };
  return (
    <div className={style.all}>
      <form className={style.regForm} onSubmit={handleSubmit}>
        <header className={style.formheader}>
          <h1>Регистрация</h1>
        </header>
        <section className={style.formfield}>
          <div className={style.left}>
            <div className={style.pice}>
              <label>Имя</label>
            </div>
          </div>
          <div className={style.right}>
            <input
              type="text"
              name="firstname"
              placeholder="Иван"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            {showMinError && (
              <p className={style.error}>Минимальная длина 3 буквы</p>
            )}
            {showMaxError && (
              <p className={style.error}>Максимальная длина 50 букв</p>
            )}
            {showEmptyFirstname && (
              <p className={style.error}>Поле обязательно к заполнению</p>
            )}
          </div>
        </section>
        <section className={style.formfield}>
          <div className={style.left}>
            <div className={style.pice}>
              <label>Фамилия</label>
            </div>
          </div>
          <div className={style.right}>
            <input
              type="text"
              name="lastname"
              placeholder="Иванов"
              value={secondname}
              onChange={(e) => setSecondname(e.target.value)}
            />
            {secondnameMin && (
              <p className={style.error}>Минимальная длина 3 буквы</p>
            )}
            {secondnameMax && (
              <p className={style.error}>Максимальная длина 50 букв</p>
            )}
          </div>
        </section>
        <section className={style.formfield}>
          <div className={style.left}>
            <div className={style.pice}>
              <label>Почта</label>
            </div>
          </div>
          <div className={style.right}>
            <input
              type="email"
              name="email"
              placeholder="lalala@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {showEmptyEmail && (
              <p className={style.error}>Поле обязательно к заполнению</p>
            )}
          </div>
        </section>
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
              placeholder="darkslay"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            {showLoginMinError && (
              <p className={style.error}>Минимальная длина 3 буквы</p>
            )}
            {showLoginMaxError && (
              <p className={style.error}>Максимальная длина 50 букв</p>
            )}
            {showLoginEngError && (
              <p className={style.error}>
                Логин должен содержать только кириллицу
              </p>
            )}
            {showLoginError && (
              <p className={style.error}>
                Пользователь с таким логином уже существует
              </p>
            )}
            {showEmptyLogin && (
              <p className={style.error}>Поле обязательно к заполнению</p>
            )}
          </div>
        </section>
        <section className={style.formfield}>
          <div className={style.left}>
            <div className={style.pice}>
              <label>Фото профиля</label>
            </div>
          </div>
          <div className={style.right}>
            <input
              type="file"
              name="file"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
            {showEmptyAvatar && (
              <p className={style.error}>Поле обязательно к заполнению</p>
            )}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPasswordMinError && (
              <p className={style.error}>Минимальная длина 3 буквы</p>
            )}
            {showPasswordMaxError && (
              <p className={style.error}>Максимальная длина 50 букв</p>
            )}
            {showPasswordEngError && (
              <p className={style.error}>
                Пароль должен содержать только английские буквы
              </p>
            )}
            {showEmptyPassword && (
              <p className={style.error}>Поле обязательно к заполнению</p>
            )}
          </div>
        </section>
        <button>Зарегистрироваться</button>
        <div className={style.loginin}>
          <p>Уже есть аккаунт? </p>
          <Link to="/login">Войти</Link>
        </div>
      </form>
      {showModal && (
        <div className={style.modalBackdrop}>
          <div className={style.modal}>
            <h2>Регистрация успешна!</h2>
            <button onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
