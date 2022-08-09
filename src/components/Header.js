import logo from "../images/logo.svg";

export default function Header() {
    return(
        <header className="header">
            <img alt="Mesto Россия" src={logo} className="header__logo" />
        </header>
    )
}