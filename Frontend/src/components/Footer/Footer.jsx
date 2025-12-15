import style from "./Footer.module.css";
import tg from "../../assets/tg.png";
import whatsapp from "../../assets/whatsapp.png";
import vk from "../../assets/vk.png";
import pinterest from "../../assets/pinterest.png";
import youtube from "../../assets/youtube.png";

export default function Folder() {
  return (
    <footer>
      <div className={style.centerfooter}>
        <div className={style.topinformation}>
          <div className={style.information}>
            <table>
              <thead>
                <tr>
                  <th>Рецепты</th>
                  <th>Авторы</th>
                  <th>Редакция</th>
                  <th>Рассылка</th>
                </tr>
                <tr>
                  <th>Идеи</th>
                  <th>База</th>
                  <th>Реклама</th>
                  <th>Условия использования</th>
                </tr>
                <tr>
                  <th>Журнал</th>
                  <th>Школа «Еды»</th>
                  <th>FAQ</th>
                  <th>Сообщить об ошибке</th>
                </tr>
                <tr>
                  <th colSpan="2">Политика конфиденциальности</th>
                  <th>Спецпроекты</th>
                  <th></th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <td colSpan="4">
                    На информационном ресурсе применяются рекомендательные
                    технологии в соответствии с Правилами
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className={style.socialmedia}>
              <div className={style.rightmedia}>
                <img src={tg} alt="" />
                <img src={whatsapp} alt="" />
                <img src={vk} alt="" />
                <img src={pinterest} alt="" />
                <img src={youtube} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className={style.botinformation}>
          <p>
            © ООО «NomNom.РУ», 2025. ВСЕ ПРАВА ЗАЩИЩЕНЫ. ДЛЯ ЛИЦ СТАРШЕ 18 ЛЕТ.
          </p>
        </div>
      </div>
    </footer>
  );
}
