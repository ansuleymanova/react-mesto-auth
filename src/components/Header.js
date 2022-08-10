import logo from "../images/logo.svg";
import { Link, useLocation } from 'react-router-dom';

export default function Header(props) {
    const location = useLocation();

    return(
        <header className="header">
            <img alt="Mesto Россия" src={logo} className="header__logo" />
            {location.pathname === '/sign-in'
                ? <Link to="/sign-up" className="header__link">Регистрация</Link>
                : location.pathname === '/'
                    ? (<div className="header__info">
                        <p className="header__email">{props.email}</p>
                        <Link to="/sign-in" className="header__link" onClick={props.handleLogout}>Выйти</Link>
                    </div>)
                    : <Link to="/sign-in" className="header__link">Войти</Link>}
        </header>
    )
}