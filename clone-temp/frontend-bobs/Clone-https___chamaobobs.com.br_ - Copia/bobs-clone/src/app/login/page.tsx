import Link from 'next/link';

export default function Login() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Login</h1>

        <Link
          href="https://sso.shopfood.io/keycloak-login"
          className="bobs-purple-bg text-white font-bold py-3 px-6 rounded text-center block mb-8"
        >
          <span className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 mr-2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            ENTRE OU CADASTRE-SE
          </span>
        </Link>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Não tem uma conta ainda?{' '}
            <Link href="/cadastrar" className="text-bobs-red font-medium">
              Cadastre-se
            </Link>
          </p>

          <p className="text-sm text-gray-600">
            <Link href="/" className="text-bobs-red font-medium">
              Voltar para a home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
