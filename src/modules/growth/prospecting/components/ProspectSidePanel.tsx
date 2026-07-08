/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter,
} from "@/modules/_shared/components/SidePanel";
import { Button } from "@/modules/_shared/components/Button";
import { Badge } from "@/modules/_shared/components/Badge";
import { Skeleton } from "@/modules/_shared/components/Skeleton";
import {
  MapPin,
  Phone,
  Globe,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Activity,
  TrendingUp,
  Star,
  Copy,
  PenLine,
  RefreshCw,
  Mail as MailIcon,
  MessageSquare,
  Clock,
  Briefcase,
  Wand2,
  ListTodo,
} from "lucide-react";
import type { ProspectEntity } from "../domain/entities/prospect.entity";
import {
  analyzeProspectAction,
  convertProspectToLeadAction,
  generateProposalAction,
} from "../presentation/actions";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/modules/_shared/components/Tabs";
import { Textarea } from "@/modules/_shared/components/Textarea";

interface ProspectSidePanelProps {
  prospect: ProspectEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProspect?: ProspectEntity) => void;
}

export function ProspectSidePanel({ prospect, isOpen, onClose, onUpdate }: ProspectSidePanelProps) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isConverting, setIsConverting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("intelligence");
  const [draftContent, setDraftContent] = React.useState(prospect?.messageDraft || "");

  React.useEffect(() => {
    if (prospect?.messageDraft) {
      setDraftContent(prospect.messageDraft);
    }
  }, [prospect?.messageDraft]);

  const handleAnalyze = async () => {
    if (!prospect) return;
    setIsAnalyzing(true);
    const loadingToast = toast.loading(`Analizando ${prospect.name}...`);
    try {
      const response = await analyzeProspectAction(prospect.id);
      if (response.success) {
        toast.success("Análisis IA completado", { id: loadingToast });
        onUpdate(response.data);
      } else {
        toast.error("Error en el análisis", { description: response.error, id: loadingToast });
      }
    } catch {
      toast.error("Error inesperado", { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!prospect) return;
    setIsGenerating(true);
    const loadingToast = toast.loading(`Redactando propuesta para ${prospect.name}...`);
    try {
      const response = await generateProposalAction(prospect.id);
      if (response.success) {
        toast.success("Propuesta redactada exitosamente", { id: loadingToast });
        if (response.data?.messageDraft) {
          setDraftContent(response.data.messageDraft);
        }
        onUpdate(response.data);
      } else {
        toast.error("Error generando propuesta", { description: response.error, id: loadingToast });
      }
    } catch {
      toast.error("Error inesperado", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftContent);
    toast.success("Copiado al portapapeles", { description: "Listo para enviar." });
  };

  const handleConvertToLead = async () => {
    if (!prospect || prospect.convertedToLeadId) return;

    const finalMessage = draftContent.trim();
    if (!finalMessage) {
      toast.error("Primero genera o escribe una propuesta.");
      return;
    }

    setIsConverting(true);
    const loadingToast = toast.loading(`Convirtiendo ${prospect.name}...`);
    try {
      const response = await convertProspectToLeadAction(prospect.id, finalMessage);
      if (response.success) {
        toast.success("Cliente potencial creado en CRM", { id: loadingToast });
        onUpdate(response.data);
      } else {
        toast.error("Error al convertir prospecto", {
          description: response.error,
          id: loadingToast,
        });
      }
    } catch {
      toast.error("Error inesperado", { id: loadingToast });
    } finally {
      setIsConverting(false);
    }
  };

  const scoreRationale = prospect?.scoreRationale as Record<string, unknown> | null;
  const summary = (scoreRationale?.summary as string) || "Pendiente de resumen ejecutivo.";

  const signals = prospect?.signals as Record<string, unknown> | null;
  const strengths = Array.isArray(signals?.strengths) ? signals.strengths : [];
  const weaknesses = Array.isArray(signals?.weaknesses) ? signals.weaknesses : [];

  const opportunities = Array.isArray(prospect?.opportunities) ? prospect.opportunities : [];

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} width="xl" className="bg-[#060b11]">
      {!prospect ? (
        <div className="flex h-full items-center justify-center p-12">
          <Skeleton className="h-[400px] w-full opacity-50" />
        </div>
      ) : (
        <>
          <SidePanelHeader
            title={null}
            description={null}
            onClose={onClose}
            className="p-0 border-none bg-transparent absolute top-0 right-0 z-50 w-full flex justify-end p-4"
          />

          <SidePanelBody className="p-0 bg-transparent overflow-y-auto custom-scrollbar">
            <div className="flex flex-col relative min-h-full pb-32">
              {/* Cover Image */}
              <div className="h-48 md:h-64 w-full relative shrink-0 bg-[#0B0D12]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b11] via-transparent to-transparent z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80`}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                />
              </div>

              {/* Header Content overlaying cover */}
              <div className="px-8 md:px-12 -mt-16 relative z-20 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex items-end gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-[var(--c-bg-elevated)] border-2 border-[#060b11] flex items-center justify-center shrink-0 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--c-accent)]/20 to-transparent pointer-events-none" />
                      <Building2 className="w-10 h-10 text-[var(--c-accent)] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)] relative z-10" />
                    </div>
                    <div className="flex flex-col gap-2 pb-2">
                      <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        {prospect.name}
                      </h1>
                      <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--c-text-secondary)]">
                        <span className="text-[var(--c-accent)] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent)] shadow-[0_0_5px_var(--c-accent)]" />
                          {(() => {
                            const m = prospect.metadata as Record<string, unknown> | null;
                            const c = (m?.category as string) || "";
                            return c && c !== "business"
                              ? c
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l: string) => l.toUpperCase())
                              : "Negocio";
                          })()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[var(--c-border-strong)]" />
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {prospect.address || "Sin ubicación"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pb-2">
                    <button className="h-10 px-4 rounded-xl bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] flex items-center gap-2 text-[13px] font-bold text-[var(--c-text-primary)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent)] transition-all shadow-tactile">
                      <Globe className="w-4 h-4" /> Visitar sitio
                    </button>
                    {!prospect.convertedToLeadId && (
                      <button
                        onClick={handleConvertToLead}
                        disabled={isConverting}
                        className="h-10 px-6 rounded-xl bg-[var(--c-violet)] text-white font-bold text-[13px] flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:bg-[#b388ff] transition-all disabled:opacity-50"
                      >
                        {isConverting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                        Añadir al CRM
                      </button>
                    )}
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] rounded-2xl p-4 shadow-tactile">
                  <div className="flex flex-col gap-1.5 px-4 border-r border-[var(--c-border-strong)]">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Score IA
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-black ${prospect.qualityScore && prospect.qualityScore >= 80 ? "text-[var(--c-accent)] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" : prospect.qualityScore && prospect.qualityScore >= 50 ? "text-[var(--c-warning)]" : "text-[var(--c-text-primary)]"}`}
                      >
                        {prospect.qualityScore || "--"}
                      </span>
                      <span className="text-[11px] font-bold text-[var(--c-text-tertiary)]">
                        / 100
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 px-4 md:border-r border-[var(--c-border-strong)]">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Reputación
                    </span>
                    <div className="flex items-center gap-2 text-2xl font-black text-white">
                      {prospect.rating || "--"}
                      {prospect.rating && (
                        <Star className="w-5 h-5 fill-[var(--c-warning)] text-[var(--c-warning)] drop-shadow-[0_0_8px_rgba(255,234,0,0.5)]" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 px-4 border-r border-[var(--c-border-strong)]">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Estado
                    </span>
                    <Badge
                      variant={prospect.analysisStatus === "COMPLETED" ? "success" : "secondary"}
                      className="w-fit mt-1"
                    >
                      {prospect.analysisStatus === "COMPLETED" ? "ANALIZADO" : "PENDIENTE"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1.5 px-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Operación
                    </span>
                    <div className="flex items-center gap-2 text-[14px] font-bold mt-1">
                      {prospect.businessStatus === "OPERATIONAL" ? (
                        <span className="text-[var(--c-success)] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[var(--c-success)] shadow-[0_0_8px_var(--c-success)]" />{" "}
                          ABIERTO
                        </span>
                      ) : (
                        <span className="text-[var(--c-text-secondary)]">
                          {prospect.businessStatus || "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Info Grid */}
              <div className="px-8 md:px-12 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B0D12] flex items-center justify-center border border-[var(--c-border-strong)] shadow-tactile shrink-0 group-hover:border-[var(--c-accent-border)] transition-colors">
                      <Phone className="w-4 h-4 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                        Teléfono
                      </span>
                      <span
                        className={
                          prospect.phone
                            ? "text-[var(--c-text-primary)] font-bold text-[14px]"
                            : "text-[var(--c-text-tertiary)] font-medium text-[13px]"
                        }
                      >
                        {prospect.phone || "Sin teléfono"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B0D12] flex items-center justify-center border border-[var(--c-border-strong)] shadow-tactile shrink-0 group-hover:border-[var(--c-accent-border)] transition-colors">
                      <Globe className="w-4 h-4 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                        Sitio Web
                      </span>
                      {prospect.website ? (
                        <a
                          href={prospect.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--c-text-primary)] hover:text-[var(--c-accent)] font-bold text-[14px] truncate transition-colors"
                        >
                          {prospect.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      ) : (
                        <span className="text-[var(--c-text-tertiary)] font-medium text-[13px]">
                          Sin sitio web
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              {(() => {
                const m = prospect.metadata as Record<string, unknown> | null;
                const photos = m?.photos as string[] | undefined;
                if (!photos || photos.length === 0) return null;
                return (
                  <div className="px-8 md:px-12 mt-8">
                    <h4 className="text-[10px] font-bold text-[var(--c-text-tertiary)] uppercase tracking-widest mb-4">
                      FOTOGRAFÍAS ({photos.length})
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                      {photos.slice(0, 6).map((photoId, idx) => (
                        <div
                          key={idx}
                          className="w-32 h-32 shrink-0 rounded-2xl border border-[var(--c-border-strong)] bg-[#0B0D12] overflow-hidden shadow-tactile group-hover:border-[var(--c-accent)] transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/places/photo?id=${encodeURIComponent(photoId)}`}
                            alt={`Foto ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-80 hover:opacity-100"
                            onError={(e) => {
                              e.currentTarget.parentElement!.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Tabs System for Architecture Future-proofing */}
              <Tabs className="flex-1 flex flex-col mt-4 min-h-[500px]">
                <TabsList className="px-10 border-b border-[var(--c-border-strong)] sticky top-0 bg-[var(--c-bg-elevated)] z-10 flex gap-8 justify-start pt-2 pb-4">
                  <TabsTrigger
                    value="intelligence"
                    active={activeTab === "intelligence"}
                    onClick={() => setActiveTab("intelligence")}
                    className="hover:text-[var(--c-accent)] transition-colors data-[state=active]:text-[var(--c-accent)] data-[state=active]:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] font-bold tracking-wider"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    INTELIGENCIA IA
                  </TabsTrigger>
                  <TabsTrigger
                    value="outreach"
                    active={activeTab === "outreach"}
                    onClick={() => setActiveTab("outreach")}
                    className="hover:text-[var(--c-accent)] transition-colors data-[state=active]:text-[var(--c-accent)] data-[state=active]:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] font-bold tracking-wider"
                  >
                    <MailIcon className="w-4 h-4 mr-2" />
                    CONTACTO
                  </TabsTrigger>

                  <div className="w-[1px] h-4 bg-[var(--c-border-strong)] mx-2 hidden sm:block self-center" />

                  {/* Future Architecture Stubs */}
                  <TabsTrigger value="timeline" disabled className="opacity-30 tracking-wider">
                    <Clock className="w-4 h-4 mr-2" /> HISTORIAL
                  </TabsTrigger>
                  <TabsTrigger
                    value="meetings"
                    disabled
                    className="opacity-30 hidden md:inline-flex tracking-wider"
                  >
                    <Briefcase className="w-4 h-4 mr-2" /> REUNIONES
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    disabled
                    className="opacity-30 hidden lg:inline-flex tracking-wider"
                  >
                    <ListTodo className="w-4 h-4 mr-2" /> TAREAS
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 flex flex-col px-10 py-10 bg-transparent relative">
                  <TabsContent
                    value="intelligence"
                    active={activeTab === "intelligence"}
                    className="flex-1 flex flex-col"
                  >
                    {prospect.analysisStatus === "COMPLETED" ? (
                      <div className="flex flex-col gap-12">
                        {/* Summary & Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                          <div className="col-span-1 md:col-span-3 flex flex-col gap-4 relative z-10">
                            <h3 className="text-[10px] font-bold text-[var(--c-accent)] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">
                              RESUMEN EJECUTIVO
                            </h3>
                            <p className="text-[14px] text-[var(--c-text-primary)] leading-relaxed font-medium bg-[var(--c-bg-elevated)] p-6 rounded-[var(--r-xl)] border border-[var(--c-border-strong)] shadow-tactile">
                              {summary}
                            </p>
                          </div>
                          <div className="col-span-1 flex flex-col gap-5 p-6 rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile relative overflow-hidden group justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-[var(--c-accent)]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col gap-2 relative z-10">
                              <span className="text-[9px] uppercase text-[var(--c-text-tertiary)] font-bold tracking-[0.2em]">
                                PRIORIDAD
                              </span>
                              <div className="flex items-center gap-2 text-[16px] font-black text-[var(--c-text-primary)]">
                                <Activity className="w-4 h-4 text-[var(--c-danger)] drop-shadow-[0_0_8px_rgba(255,23,68,0.8)]" />{" "}
                                HIGH
                              </div>
                            </div>
                            <div className="w-full h-[1px] bg-[var(--c-border-strong)] relative z-10" />
                            <div className="flex flex-col gap-2 relative z-10">
                              <span className="text-[9px] uppercase text-[var(--c-text-tertiary)] font-bold tracking-[0.2em]">
                                PROB. CIERRE
                              </span>
                              <div className="flex items-center gap-2 text-[16px] font-black text-[var(--c-text-primary)]">
                                <TrendingUp className="w-4 h-4 text-[var(--c-success)] drop-shadow-[0_0_8px_rgba(0,230,118,0.8)]" />{" "}
                                75%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Signals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="flex flex-col gap-5">
                            <h3 className="text-[10px] font-bold text-[var(--c-text-secondary)] uppercase tracking-widest flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-[var(--c-bg-elevated)] flex items-center justify-center border border-[var(--c-success)]/30 shadow-[0_0_10px_rgba(0,230,118,0.2)]">
                                <CheckCircle2 className="w-4 h-4 text-[var(--c-success)]" />
                              </div>
                              FORTALEZAS
                            </h3>
                            <ul className="flex flex-col gap-4">
                              {strengths.map((s, i) => (
                                <li
                                  key={i}
                                  className="text-[14px] leading-relaxed font-medium text-[var(--c-text-primary)] flex items-start gap-4 bg-[var(--c-bg-elevated)] p-5 rounded-[var(--r-xl)] border border-[var(--c-border-strong)] shadow-tactile hover:border-[var(--c-success)]/50 transition-colors"
                                >
                                  <div className="w-2 h-2 rounded-full bg-[var(--c-success)] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
                                  {s as string}
                                </li>
                              ))}
                              {strengths.length === 0 && (
                                <span className="text-[13px] font-bold text-[var(--c-text-tertiary)] p-4">
                                  Sin fortalezas destacadas.
                                </span>
                              )}
                            </ul>
                          </div>

                          <div className="flex flex-col gap-5">
                            <h3 className="text-[10px] font-bold text-[var(--c-text-secondary)] uppercase tracking-widest flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-[var(--c-bg-elevated)] flex items-center justify-center border border-[var(--c-danger)]/30 shadow-[0_0_10px_rgba(255,23,68,0.2)]">
                                <AlertTriangle className="w-4 h-4 text-[var(--c-danger)]" />
                              </div>
                              PROBLEMAS / DOLORES
                            </h3>
                            <ul className="flex flex-col gap-4">
                              {weaknesses.map((w, i) => (
                                <li
                                  key={i}
                                  className="text-[14px] leading-relaxed font-medium text-[var(--c-text-primary)] flex items-start gap-4 bg-[var(--c-bg-elevated)] p-5 rounded-[var(--r-xl)] border border-[var(--c-border-strong)] shadow-tactile hover:border-[var(--c-danger)]/50 transition-colors"
                                >
                                  <div className="w-2 h-2 rounded-full bg-[var(--c-danger)] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,23,68,0.8)]" />
                                  {w as string}
                                </li>
                              ))}
                              {weaknesses.length === 0 && (
                                <span className="text-[13px] font-bold text-[var(--c-text-tertiary)] p-4">
                                  Sin dolores identificados.
                                </span>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Opportunities and Recommended Services */}
                        <div className="flex flex-col gap-6 mt-4 pb-8">
                          <h3 className="text-[10px] font-bold text-[var(--c-accent)] uppercase tracking-widest flex items-center gap-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">
                            <div className="w-7 h-7 rounded-full bg-[var(--c-bg-elevated)] flex items-center justify-center border border-[var(--c-accent)] shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                              <Lightbulb className="w-4 h-4 text-[var(--c-accent)]" />
                            </div>
                            SERVICIOS RECOMENDADOS & OPORTUNIDADES
                          </h3>
                          <div className="grid grid-cols-1 gap-5">
                            {opportunities.length > 0 ? (
                              opportunities.map((opp: Record<string, unknown>, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col md:flex-row gap-5 p-8 rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile hover:shadow-glow hover:border-[var(--c-accent-border)] transition-all group"
                                >
                                  <div className="flex-1 flex flex-col gap-3.5">
                                    <div className="flex items-center gap-4">
                                      <span className="text-[16px] font-black text-[var(--c-text-primary)] capitalize group-hover:text-[var(--c-accent)] transition-colors">
                                        {typeof opp.type === "string"
                                          ? opp.type.replace(/_/g, " ")
                                          : "Oportunidad"}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] py-1 px-3 bg-[var(--c-bg-base)] border-[var(--c-accent-border)] text-[var(--c-accent)] shadow-[0_0_10px_rgba(0,229,255,0.1)] font-bold tracking-widest"
                                      >
                                        SOLUCIÓN
                                      </Badge>
                                    </div>
                                    <p className="text-[14px] text-[var(--c-text-secondary)] leading-relaxed font-medium">
                                      <span className="font-bold text-[var(--c-text-primary)] uppercase tracking-wider text-[11px] mr-2">
                                        Por qué lo necesitan:
                                      </span>
                                      {typeof opp.description === "string" ? opp.description : ""}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span className="text-[13px] font-bold text-[var(--c-text-tertiary)] p-4">
                                No se identificaron oportunidades claras.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : prospect.analysisStatus === "IN_PROGRESS" || isAnalyzing ? (
                      <div className="flex flex-col flex-1 justify-between py-10">
                        <div className="flex flex-col gap-12 animate-pulse opacity-70 mb-12 relative z-10 w-full max-w-4xl mx-auto">
                          {/* Summary & Metrics Skeleton */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                            <div className="col-span-1 md:col-span-3 flex flex-col gap-5">
                              <Skeleton className="h-4 w-40 rounded-[var(--r-md)] bg-[var(--c-border-strong)]" />
                              <div className="flex flex-col gap-4 p-6 rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]">
                                <Skeleton className="h-5 w-full rounded bg-[var(--c-bg-base)]" />
                                <Skeleton className="h-5 w-11/12 rounded bg-[var(--c-bg-base)]" />
                                <Skeleton className="h-5 w-4/5 rounded bg-[var(--c-bg-base)]" />
                              </div>
                            </div>
                            <div className="col-span-1 flex flex-col gap-5 p-6 rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]">
                              <Skeleton className="h-12 w-full rounded bg-[var(--c-bg-base)]" />
                              <div className="w-full h-[1px] bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-12 w-full rounded bg-[var(--c-bg-base)]" />
                            </div>
                          </div>

                          {/* Signals Grid Skeleton */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-5">
                              <Skeleton className="h-4 w-32 rounded-[var(--r-md)] bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-16 w-full rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                              <Skeleton className="h-16 w-full rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                            </div>
                            <div className="flex flex-col gap-5">
                              <Skeleton className="h-4 w-40 rounded-[var(--r-md)] bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-16 w-full rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                              <Skeleton className="h-16 w-full rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                            </div>
                          </div>
                        </div>

                        {/* Kept button disabled at the bottom */}
                        <div className="flex justify-center relative z-10 mt-auto">
                          <Button
                            disabled={true}
                            className="w-full max-w-sm rounded-[var(--r-full)] bg-[var(--c-bg-elevated)] border-[var(--c-accent)] text-[var(--c-accent)] shadow-[0_0_15px_rgba(0,229,255,0.3)] opacity-80 py-6 text-[14px]"
                          >
                            <Sparkles className="w-5 h-5 mr-3 text-[var(--c-accent)] animate-pulse" />
                            ANALIZANDO CON AXIOM IA...
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-20 relative z-10 w-full min-h-[400px]">
                        <div
                          className="w-20 h-20 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile flex items-center justify-center mb-8 relative group cursor-pointer hover:shadow-glow hover:border-[var(--c-accent-border)] transition-all"
                          onClick={handleAnalyze}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--c-accent)]/10 to-transparent rounded-[var(--r-2xl)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Wand2 className="w-8 h-8 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors drop-shadow-[0_0_8px_rgba(0,229,255,0)] group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                        </div>
                        <p className="text-[22px] font-black tracking-tight text-[var(--c-text-primary)] mb-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">
                          Sin Inteligencia Comercial
                        </p>
                        <p className="text-[15px] font-medium text-[var(--c-text-secondary)] leading-relaxed mb-10 px-6">
                          Ejecuta el motor de IA para descubrir los dolores del negocio, extraer el
                          Score IA y recomendar soluciones precisas.
                        </p>
                        <Button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="w-full max-w-[280px] rounded-[var(--r-full)] bg-[var(--c-bg-elevated)] border border-[var(--c-accent)] text-[var(--c-accent)] shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:bg-[var(--c-accent)]/10 font-bold tracking-widest transition-all py-6 text-[14px]"
                        >
                          <Sparkles className="w-5 h-5 mr-3" />
                          EJECUTAR ANÁLISIS IA
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="outreach"
                    active={activeTab === "outreach"}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex flex-col gap-8 relative z-10 w-full max-w-4xl mx-auto">
                      <div className="flex items-center justify-between p-6 rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-[16px] font-black tracking-tight text-[var(--c-text-primary)] drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">
                            Cold Email & Propuesta
                          </h3>
                          <p className="text-[12px] font-medium text-[var(--c-text-tertiary)]">
                            Basado en los dolores descubiertos en el análisis.
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {prospect.messageDraft && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={handleCopyDraft}
                              className="rounded-[var(--r-full)] text-[12px] font-bold border border-[var(--c-border-strong)] shadow-sm hover:border-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] transition-all bg-[var(--c-bg-base)] px-4"
                            >
                              <Copy className="w-4 h-4 mr-2" /> Copiar
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleGenerateProposal}
                            disabled={isGenerating || prospect.analysisStatus !== "COMPLETED"}
                            className="rounded-[var(--r-full)] text-[12px] font-bold bg-[var(--c-accent)] text-[#0b0d12] border-none shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.7)] hover:bg-[#33ebff] transition-all px-5"
                          >
                            {isGenerating ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin text-[#0b0d12]" />
                            ) : prospect.messageDraft ? (
                              <RefreshCw className="w-4 h-4 mr-2 text-[#0b0d12]" />
                            ) : (
                              <PenLine className="w-4 h-4 mr-2 text-[#0b0d12]" />
                            )}
                            {prospect.messageDraft ? "Regenerar" : "Redactar (IA)"}
                          </Button>
                        </div>
                      </div>

                      {prospect.messageDraft ? (
                        <div className="flex flex-col gap-4">
                          <Textarea
                            className="min-h-[450px] text-[15px] leading-relaxed font-medium font-sans resize-y bg-[var(--c-bg-elevated)] border-[var(--c-border-strong)] rounded-[var(--r-xl)] shadow-inner p-8 focus-visible:ring-[var(--c-accent)] focus-visible:border-[var(--c-accent)] transition-all text-[var(--c-text-primary)]"
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Tu propuesta aparecerá aquí..."
                          />
                          <p className="text-[11px] font-bold tracking-wider text-[var(--c-text-tertiary)] text-right px-2">
                            * PUEDES EDITAR EL TEXTO DIRECTAMENTE ANTES DE COPIARLO. CREADO POR{" "}
                            <span className="text-[var(--c-accent)]">
                              {prospect.messageDraftModel}
                            </span>
                            .
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[var(--c-border-strong)] rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)]/50 backdrop-blur-sm shadow-inner group">
                          <div className="w-20 h-20 rounded-full bg-[var(--c-bg-base)] flex items-center justify-center mb-6 shadow-tactile border border-[var(--c-border-strong)] group-hover:border-[var(--c-accent-border)] transition-colors">
                            <MessageSquare className="w-8 h-8 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors" />
                          </div>
                          <p className="text-[15px] font-medium text-[var(--c-text-secondary)] mb-4 max-w-[350px] leading-relaxed">
                            {prospect.analysisStatus !== "COMPLETED"
                              ? "Debes analizar el negocio primero para generar una propuesta personalizada."
                              : "Genera una propuesta comercial altamente personalizada basada en el análisis IA."}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </SidePanelBody>

          {/* Action Bar Footer */}
          <SidePanelFooter className="justify-between items-center border-t border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)]/95 backdrop-blur-xl py-6 px-10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] z-20 relative">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] font-bold tracking-wide rounded-[var(--r-full)] hover:bg-[var(--c-bg-subtle)] transition-all px-6 py-5"
            >
              Cerrar
            </Button>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setActiveTab("outreach")}
                disabled={activeTab === "outreach"}
                variant="secondary"
                className="font-bold tracking-wide rounded-[var(--r-full)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] hover:border-[var(--c-text-secondary)] transition-all px-6 py-5"
              >
                Ver Propuesta
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || prospect.analysisStatus === "IN_PROGRESS"}
                className="font-bold tracking-wide rounded-[var(--r-full)] bg-[var(--c-bg-base)] border border-[var(--c-border-strong)] hover:border-[var(--c-accent)] text-[var(--c-text-primary)] hover:text-[var(--c-accent)] hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all px-6 py-5"
              >
                {prospect.analysisStatus === "COMPLETED" ? "Re-analizar" : "Analizar Prospecto"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleConvertToLead}
                disabled={
                  isConverting ||
                  Boolean(prospect.convertedToLeadId) ||
                  prospect.analysisStatus !== "COMPLETED" ||
                  !draftContent.trim()
                }
                className="font-bold tracking-wide rounded-[var(--r-full)] bg-[var(--c-success)] text-[#0b0d12] border-none shadow-[0_0_20px_rgba(0,230,118,0.5)] hover:shadow-[0_0_30px_rgba(0,230,118,0.8)] hover:bg-[#33ff99] transition-all disabled:opacity-50 disabled:shadow-none px-6 py-5 ml-2"
              >
                {isConverting ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin text-[#0b0d12]" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 mr-2 text-[#0b0d12]" />
                )}
                {prospect.convertedToLeadId ? "Convertido a Lead" : "Convertir a Lead"}
              </Button>
            </div>
          </SidePanelFooter>
        </>
      )}
    </SidePanel>
  );
}
