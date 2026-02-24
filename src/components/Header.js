import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">
          TextTools<span>Pro</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/">Tools</Link>
            </li>
            <li>
              <Link href="/tools/json-formatter">Pro</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
