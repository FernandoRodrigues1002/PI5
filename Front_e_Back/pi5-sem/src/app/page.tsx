import Link from "next/link";

export default function Home() {
  return (
  <div>
    <h1>Teste</h1>

    <Link href="/pages/cadastro">cadastro </Link>
    <Link href="/pages/login">login </Link>
  </div>
  );
}
