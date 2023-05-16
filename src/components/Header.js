import logo from '../images/logo.svg';

function Header() {
  
  return (
    <header className="header">
      <a href="#" className="header__logo-link">
        <img src={logo} alt="Логотип сайта" className="header__logo"/>
      </a>
    </header>
  );
}

export default  Header;