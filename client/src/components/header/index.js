import { h } from 'preact' // eslint-disable-line no-unused-vars
import { Link } from 'preact-router/match' // eslint-disable-line no-unused-vars
import style from './style'

const Header = () => (
  <header className={style.header}>
    <h1>Preact App</h1>
    <nav>
      <Link activeClassName={style.active} href="/">Home</Link>
      <Link activeClassName={style.active} href="/profile">Me</Link>
      <Link activeClassName={style.active} href="/profile/john">John</Link>
    </nav>
  </header>
)

export default Header
