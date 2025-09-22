"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Página única com 8 abas (uma por grupo) – sem banco de dados.
 *
 * Como usar:
 * 1) Cole este arquivo em src/app/page.tsx
 * 2) Edite os conteúdos no array GROUPS abaixo.
 * 3) Rodar: npm run dev  → http://localhost:3000
 *
 * Recursos:
 * - Tabs acessíveis (WAI-ARIA), teclado (Setas, Home, End), foco visível.
 * - Link por hash (#grupo-3) para abrir a aba direto + botão “Copiar link”.
 * - Layout responsivo, dark mode (segue preferência do sistema).
 * - Botão “Imprimir/Salvar PDF”.
 * - Sem dependências além de React + Tailwind.
 */

// === Conteúdo estático (edite aqui) =========================================
const GROUPS: { id: string; title: string; lead?: string; content: React.ReactNode }[] = [
  {
    id: "grupo-1",
    title: "Grupo 1",
    lead: "Tema do grupo 1 (subtítulo curto)",
    content: (
      <div className="prose dark:prose-invert max-w-none">
        <h3>Introdução</h3>
        <p>
          Substitua este texto pelo material do grupo 1. Você pode usar títulos,
          listas e links. Este site é estático: basta editar este arquivo e fazer
          commit no GitHub para publicar.
        </p>
        <ul>
          <li>Ponto 1 explicativo</li>
          <li>Ponto 2 com referência</li>
          <li>Ponto 3 com exemplo</li>
        </ul>
      </div>
    ),
  },
  {
    id: "grupo-2",
    title: "Grupo 2",
    lead: "Tema do grupo 2 (subtítulo curto)",
    content: (
      <div className="prose dark:prose-invert max-w-none">
        <p>Conteúdo do grupo 2. Use parágrafos curtos e claros.</p>
      </div>
    ),
  },
  {
    id: "grupo-3",
    title: "Grupo 3",
    content: (
      <div className="prose dark:prose-invert max-w-none">
        <p>Conteúdo do grupo 3.</p>
      </div>
    ),
  },
  { id: "grupo-4", title: "Grupo 4", content: <p className="prose dark:prose-invert max-w-none">Conteúdo do grupo 4.</p> },
  { id: "grupo-5", title: "Grupo 5", content: <p className="prose dark:prose-invert max-w-none">Conteúdo do grupo 5.</p> },
  { id: "grupo-6", title: "Grupo 6", content: <p className="prose dark:prose-invert max-w-none">Conteúdo do grupo 6.</p> },
  { id: "grupo-7", title: "Grupo 7", content: <p className="prose dark:prose-invert max-w-none">Conteúdo do grupo 7.</p> },
  { id: "grupo-8", title: "Grupo 8", content: <p className="prose dark:prose-invert max-w-none">Conteúdo do grupo 8.</p> },
];

// === Utilitários =============================================================
function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function useHash() {
  const [hash, setHash] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [
    hash,
    (h: string) => {
      if (typeof window !== "undefined") {
        window.location.hash = h;
        setHash(h);
      }
    },
  ] as const;
}

// === Componente principal ====================================================
export default function Page() {
  const tabs = useMemo(() => GROUPS, []);
  const ids = tabs.map((t) => `#${t.id}`);
  const [hash, setHash] = useHash();
  const initialIndex = Math.max(0, ids.indexOf(hash));
  const [index, setIndex] = useState<number>(initialIndex);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Atualiza aba quando o hash muda
  useEffect(() => {
    const i = Math.max(0, ids.indexOf(hash));
    setIndex(i);
  }, [hash, ids]);

  // Copiar link da aba atual
  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${tabs[index].id}`;
    await navigator.clipboard.writeText(url);
    alert("Link copiado!");
  };

  // Acessibilidade de teclado nas tabs
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      let next = index;
      if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
      if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = last;
      setIndex(next);
      tabRefs.current[next]?.focus();
      setHash(`#${tabs[next].id}`);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-10 backdrop-blur supports-backdrop-blur:bg-white/60 bg-white/70 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-slate-900 dark:bg-slate-100" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Testes Psicológicos — Mostruário da Turma
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                8 grupos • conteúdo público • sem banco de dados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Imprimir ou salvar em PDF"
            >
              Imprimir/PDF
            </button>
            <button
              onClick={copyLink}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Copiar link da aba atual"
            >
              Copiar link
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Tabs */}
        <div className="mt-8" onKeyDown={onKeyDown}>
          <div
            role="tablist"
            aria-label="Grupos"
            className="flex w-full overflow-auto gap-2 p-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
          >
            {tabs.map((t, i) => {
              const selected = i === index;
              return (
                <button
                  key={t.id}
                  role="tab"
                  ref={(el) => (tabRefs.current[i] = el)}
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => {
                    setIndex(i);
                    setHash(`#${t.id}`);
                  }}
                  className={classNames(
                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border",
                    selected
                      ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow"
                      : "bg-transparent border-transparent hover:bg-white/70 dark:hover:bg-slate-900/70"
                  )}
                >
                  {t.title}
                </button>
              );
            })}
          </div>

          {tabs.map((t, i) => (
            <section
              key={t.id}
              role="tabpanel"
              id={`panel-${t.id}`}
              aria-labelledby={`tab-${t.id}`}
              hidden={i !== index}
              className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 p-6 shadow-sm"
            >
              <header className="mb-4">
                <h2 className="text-lg font-semibold tracking-tight">{t.title}</h2>
                {t.lead && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t.lead}</p>
                )}
              </header>
              <div>{t.content}</div>
            </section>
          ))}
        </div>

        {/* Rodapé */}
        <footer className="mt-12 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Trabalho acadêmico — Disciplina de Testes Psicológicos. Este site é estático e não
            coleta dados pessoais.
          </p>
        </footer>
      </main>

      {/* Estilos de impressão mínimos */}
      <style>{`
        @media print {
          header, [role=tablist], button[aria-label] { display: none !important; }
          main { padding: 0 !important; }
          section { break-inside: avoid; box-shadow: none !important; border: none !important; }
        }
      `}</style>
    </div>
  );
}
