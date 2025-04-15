import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bobs-footer text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">HORÁRIOS</h3>
          <Link href="#" className="text-white opacity-80 hover:opacity-100">
            Informe seu endereço
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">PAGAMENTO</h3>
          <Link href="#" className="text-white opacity-80 hover:opacity-100">
            Informe seu endereço
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">CARTÕES ACEITOS</h3>
          <Link href="#" className="text-white opacity-80 hover:opacity-100">
            Informe seu endereço
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">LINKS ÚTEIS</h3>
          <ul className="space-y-2">
            <li>
              <Link href="https://bobs.com.br/politica-de-cookies" className="text-white opacity-80 hover:opacity-100">
                POLÍTICA DE COOKIES
              </Link>
            </li>
            <li>
              <Link href="https://bobs.com.br/politica-de-privacidade" className="text-white opacity-80 hover:opacity-100">
                POLÍTICA DE PRIVACIDADE
              </Link>
            </li>
            <li>
              <Link href="https://bobs.com.br/seja-um-fornecedor" className="text-white opacity-80 hover:opacity-100">
                SEJA UM FORNECEDOR
              </Link>
            </li>
            <li>
              <Link href="https://bobs.com.br/seja-um-franqueado" className="text-white opacity-80 hover:opacity-100">
                SEJA UM FRANQUEADO
              </Link>
            </li>
            <li>
              <Link href="/page/termos-de-uso" className="text-white opacity-80 hover:opacity-100">
                TERMOS DE USO
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">CONECTE-SE</h3>
          <div className="flex space-x-4">
            <Link href="https://www.instagram.com/bobsbrasil/" aria-label="Instagram" className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href="https://www.facebook.com/bobsbrasil" aria-label="Facebook" className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-red-700">
          <h3 className="font-bold text-lg mb-2">BOB'S</h3>
          <p className="text-sm opacity-80 mb-4">
            CFK COMÉRCIO DE ALIMENTOS LTDA.<br />
            CNPJ 08.281.783/0001-30
          </p>
          <div className="py-3 text-center text-sm opacity-80 border-t border-red-700">
            Desenvolvido por <a href="http://shopfood.io" className="underline">ShopFood</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
