import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // ✅ certo

function maskCpf(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  return n
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export default function Home() {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) {
      setErro("Digite um CPF válido (11 dígitos).");
      return;
    }
    // envia via query string para a página de consulta
    navigate(`/consultando?cpf=${digits}`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6">
        <img
         src={logo}          alt=""
          className="mb-6 h-20 w-30"
        />
        <h1 className="text-2xl font-semibold text-[#072e57]">Consulta Judicial Federal</h1>
        <p className="mt-2 text-gray-600 text-center">Consulte sua situação judicial de forma segura e confidencial</p>

        <form onSubmit={onSubmit} className="mt-6 w-full space-y-4">
          <label htmlFor="cpf" className="sr-only">CPF</label>
          <input
            id="cpf"
            inputMode="numeric"
            placeholder="000.000.000-00"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b3d73]/20"
            value={maskCpf(cpf)}
            onChange={(e) => setCpf(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#072e57] px-5 py-3 font-semibold text-white hover:bg-[#0b3d73]"
          >
            Consultar
          </button>
        </form>

        {erro && (
          <div className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        <footer className="mt-12 text-sm text-gray-500 text-center">
          © 2025 Ministério da Justiça - Governo Federal
        </footer>
      </div>
    </div>
  );
}
