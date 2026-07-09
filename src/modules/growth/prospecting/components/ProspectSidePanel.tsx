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
    <SidePanel isOpen={isOpen} onClose={onClose} width="2xl" className="bg-[var(--c-bg-base)]">
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
            className="p-0 border-none bg-transparent absolute top-0 right-0 z-50 w-full flex justify-end p-6"
          />

          <SidePanelBody className="p-0 bg-transparent overflow-y-auto custom-scrollbar">
            <div className="flex flex-col relative min-h-full pb-40">
              {/* Cover Image */}
              <div className="h-56 md:h-72 w-full relative shrink-0 bg-[var(--c-bg-base)]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,var(--c-bg-base)_100%)] z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80`}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
              </div>

              {/* Header Content overlaying cover */}
              <div className="px-10 md:px-16 -mt-20 relative z-20 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="flex items-end gap-8">
                    <div className="w-28 h-28 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border-2 border-[var(--c-bg-base)] flex items-center justify-center shrink-0 shadow-[0_20px_40px_-10px_rgb(11_13_18_/_1)] relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--c-accent)]/20 to-transparent pointer-events-none" />
                      <Building2 className="w-12 h-12 text-[var(--c-accent)] drop-shadow-[0_0_12px_rgb(99_102_241_/_0.8)] relative z-10" />
                    </div>
                    <div className="flex flex-col gap-3 pb-2">
                      <h1 className="text-4xl md:text-[44px] font-black tracking-tight leading-none text-[var(--c-text-primary)] drop-shadow-[0_0_15px_rgb(230_232_238_/_0.15)]">
                        {prospect.name}
                      </h1>
                      <div className="flex items-center gap-4 text-[14px] font-medium text-[var(--c-text-secondary)]">
                        <span className="text-[var(--c-accent)] flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[var(--c-accent)] shadow-[0_0_8px_var(--c-accent)]" />
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
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-border-strong)]" />
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[var(--c-text-tertiary)]" />
                          {prospect.address || "Sin ubicación"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pb-2">
                    <button className="h-12 px-6 rounded-[var(--r-xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] flex items-center gap-2.5 text-[14px] font-bold text-[var(--c-text-primary)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent)] hover:shadow-[0_0_20px_-5px_rgb(99_102_241_/_0.3)] transition-all shadow-tactile">
                      <Globe className="w-5 h-5" /> Visitar sitio
                    </button>
                    {!prospect.convertedToLeadId && (
                      <button
                        onClick={handleConvertToLead}
                        disabled={isConverting}
                        className="h-12 px-8 rounded-[var(--r-xl)] bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent))] text-[var(--c-text-primary)] font-black text-[14px] flex items-center gap-2.5 shadow-[0_12px_24px_-10px_rgba(168,85,247,0.6)] hover:shadow-[0_16px_32px_-10px_rgba(168,85,247,0.8)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                      >
                        {isConverting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                        Añadir al CRM
                      </button>
                    )}
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] rounded-[var(--r-2xl)] p-6 shadow-tactile mt-2">
                  <div className="flex flex-col gap-2 px-4 border-r border-[var(--c-border-strong)]">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Score IA
                    </span>
                    <div className="flex items-end gap-2">
                      <span
                        className={`text-3xl font-black leading-none ${prospect.qualityScore && prospect.qualityScore >= 80 ? "text-[var(--c-accent)] drop-shadow-[0_0_12px_rgb(99_102_241_/_0.5)]" : prospect.qualityScore && prospect.qualityScore >= 50 ? "text-[var(--c-warning)]" : "text-[var(--c-text-primary)]"}`}
                      >
                        {prospect.qualityScore || "--"}
                      </span>
                      <span className="text-[13px] font-bold text-[var(--c-text-tertiary)] pb-1">
                        / 100
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 px-4 md:border-r border-[var(--c-border-strong)]">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Reputación
                    </span>
                    <div className="flex items-center gap-2.5 text-3xl font-black text-[var(--c-text-primary)] leading-none">
                      {prospect.rating || "--"}
                      {prospect.rating && (
                        <Star className="w-6 h-6 fill-[var(--c-warning)] text-[var(--c-warning)] drop-shadow-[0_0_12px_rgba(255,234,0,0.5)]" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 px-4 border-r border-[var(--c-border-strong)] justify-center">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Estado
                    </span>
                    <Badge
                      variant={prospect.analysisStatus === "COMPLETED" ? "success" : "secondary"}
                      className="w-fit mt-1.5 px-3 py-1.5 text-[11px]"
                    >
                      {prospect.analysisStatus === "COMPLETED" ? "ANALIZADO" : "PENDIENTE"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2 px-4 justify-center">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                      Operación
                    </span>
                    <div className="flex items-center gap-2.5 text-[15px] font-bold mt-1.5">
                      {prospect.businessStatus === "OPERATIONAL" ? (
                        <span className="text-[var(--c-success)] flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--c-success)] shadow-[0_0_10px_var(--c-success)]" />{" "}
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
              <div className="px-10 md:px-16 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4 p-6 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile group hover:shadow-[0_0_20px_-5px_rgb(99_102_241_/_0.2)] hover:border-[var(--c-border-hover)] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--c-bg-base)] flex items-center justify-center border border-[var(--c-border-strong)] shadow-tactile shrink-0 group-hover:border-[var(--c-accent-border)] transition-colors">
                      <Phone className="w-5 h-5 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                        Teléfono
                      </span>
                      <span
                        className={
                          prospect.phone
                            ? "text-[var(--c-text-primary)] font-black text-[16px]"
                            : "text-[var(--c-text-tertiary)] font-medium text-[15px]"
                        }
                      >
                        {prospect.phone || "Sin teléfono"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-6 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile group hover:shadow-[0_0_20px_-5px_rgb(99_102_241_/_0.2)] hover:border-[var(--c-border-hover)] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--c-bg-base)] flex items-center justify-center border border-[var(--c-border-strong)] shadow-tactile shrink-0 group-hover:border-[var(--c-accent-border)] transition-colors">
                      <Globe className="w-5 h-5 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors" />
                    </div>
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--c-text-tertiary)]">
                        Sitio Web
                      </span>
                      {prospect.website ? (
                        <a
                          href={prospect.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--c-text-primary)] hover:text-[var(--c-accent)] font-black text-[16px] truncate transition-colors"
                        >
                          {prospect.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      ) : (
                        <span className="text-[var(--c-text-tertiary)] font-medium text-[15px]">
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
                  <div className="px-10 md:px-16 mt-12">
                    <h4 className="text-[12px] font-bold text-[var(--c-text-tertiary)] uppercase tracking-widest mb-6">
                      FOTOGRAFÍAS ({photos.length})
                    </h4>
                    <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar">
                      {photos.slice(0, 6).map((photoId, idx) => (
                        <div
                          key={idx}
                          className="w-40 h-40 shrink-0 rounded-[var(--r-2xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] overflow-hidden shadow-tactile group-hover:border-[var(--c-accent)] transition-all cursor-pointer hover:shadow-[0_0_24px_rgb(99_102_241_/_0.2)]"
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
              <Tabs className="flex-1 flex flex-col mt-8 min-h-[600px]">
                <TabsList className="px-12 border-b border-[var(--c-border-strong)] sticky top-0 bg-[var(--c-bg-elevated)]/90 backdrop-blur-xl z-30 flex gap-10 justify-start pt-4 pb-5">
                  <TabsTrigger
                    value="intelligence"
                    active={activeTab === "intelligence"}
                    onClick={() => setActiveTab("intelligence")}
                    className="hover:text-[var(--c-accent)] transition-colors data-[state=active]:text-[var(--c-accent)] data-[state=active]:drop-shadow-[0_0_12px_rgb(99_102_241_/_0.8)] font-black tracking-widest text-[13px]"
                  >
                    <Sparkles className="w-5 h-5 mr-2.5" />
                    INTELIGENCIA IA
                  </TabsTrigger>
                  <TabsTrigger
                    value="outreach"
                    active={activeTab === "outreach"}
                    onClick={() => setActiveTab("outreach")}
                    className="hover:text-[var(--c-accent)] transition-colors data-[state=active]:text-[var(--c-accent)] data-[state=active]:drop-shadow-[0_0_12px_rgb(99_102_241_/_0.8)] font-black tracking-widest text-[13px]"
                  >
                    <MailIcon className="w-5 h-5 mr-2.5" />
                    CONTACTO
                  </TabsTrigger>

                  <div className="w-[1px] h-5 bg-[var(--c-border-strong)] mx-4 hidden sm:block self-center" />

                  {/* Future Architecture Stubs */}
                  <TabsTrigger
                    value="timeline"
                    disabled
                    className="opacity-30 tracking-widest font-bold text-[13px]"
                  >
                    <Clock className="w-4 h-4 mr-2" /> HISTORIAL
                  </TabsTrigger>
                  <TabsTrigger
                    value="meetings"
                    disabled
                    className="opacity-30 hidden md:inline-flex tracking-widest font-bold text-[13px]"
                  >
                    <Briefcase className="w-4 h-4 mr-2" /> REUNIONES
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    disabled
                    className="opacity-30 hidden lg:inline-flex tracking-widest font-bold text-[13px]"
                  >
                    <ListTodo className="w-4 h-4 mr-2" /> TAREAS
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 flex flex-col px-12 py-12 bg-transparent relative">
                  <TabsContent
                    value="intelligence"
                    active={activeTab === "intelligence"}
                    className="flex-1 flex flex-col"
                  >
                    {prospect.analysisStatus === "COMPLETED" ? (
                      <div className="flex flex-col gap-16">
                        {/* Summary & Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                          <div className="col-span-1 md:col-span-3 flex flex-col gap-5 relative z-10">
                            <h3 className="text-[12px] font-bold text-[var(--c-accent)] uppercase tracking-widest drop-shadow-[0_0_8px_rgb(99_102_241_/_0.5)]">
                              RESUMEN EJECUTIVO
                            </h3>
                            <p className="text-[16px] text-[var(--c-text-primary)] leading-relaxed font-medium bg-[var(--c-bg-elevated)] p-8 rounded-[var(--r-2xl)] border border-[var(--c-border-strong)] shadow-tactile">
                              {summary}
                            </p>
                          </div>
                          <div className="col-span-1 flex flex-col gap-6 p-8 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile relative overflow-hidden group justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-[var(--c-accent)]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col gap-2 relative z-10">
                              <span className="text-[11px] uppercase text-[var(--c-text-tertiary)] font-bold tracking-[0.2em]">
                                PRIORIDAD
                              </span>
                              <div className="flex items-center gap-2.5 text-[20px] font-black text-[var(--c-text-primary)]">
                                <Activity className="w-5 h-5 text-[var(--c-danger)] drop-shadow-[0_0_12px_rgb(168_85_247_/_0.8)]" />{" "}
                                HIGH
                              </div>
                            </div>
                            <div className="w-full h-[1px] bg-[var(--c-border-strong)] relative z-10" />
                            <div className="flex flex-col gap-2 relative z-10">
                              <span className="text-[11px] uppercase text-[var(--c-text-tertiary)] font-bold tracking-[0.2em]">
                                PROB. CIERRE
                              </span>
                              <div className="flex items-center gap-2.5 text-[20px] font-black text-[var(--c-text-primary)]">
                                <TrendingUp className="w-5 h-5 text-[var(--c-success)] drop-shadow-[0_0_12px_rgb(34_211_238_/_0.8)]" />{" "}
                                75%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Signals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="flex flex-col gap-6">
                            <h3 className="text-[12px] font-bold text-[var(--c-text-secondary)] uppercase tracking-widest flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--c-bg-elevated)] flex items-center justify-center border border-[var(--c-success)]/30 shadow-[0_0_15px_rgb(34_211_238_/_0.2)]">
                                <CheckCircle2 className="w-4 h-4 text-[var(--c-success)]" />
                              </div>
                              FORTALEZAS
                            </h3>
                            <ul className="flex flex-col gap-5">
                              {strengths.map((s, i) => (
                                <li
                                  key={i}
                                  className="text-[15px] leading-relaxed font-medium text-[var(--c-text-primary)] flex items-start gap-4 bg-[var(--c-bg-elevated)] p-6 rounded-[var(--r-xl)] border border-[var(--c-border-strong)] shadow-tactile hover:border-[var(--c-success)]/50 transition-colors"
                                >
                                  <div className="w-2 h-2 rounded-full bg-[var(--c-success)] mt-2 shrink-0 shadow-[0_0_10px_rgb(34_211_238_/_0.8)]" />
                                  {s as string}
                                </li>
                              ))}
                              {strengths.length === 0 && (
                                <span className="text-[14px] font-bold text-[var(--c-text-tertiary)] p-4">
                                  Sin fortalezas destacadas.
                                </span>
                              )}
                            </ul>
                          </div>

                          <div className="flex flex-col gap-6">
                            <h3 className="text-[12px] font-bold text-[var(--c-text-secondary)] uppercase tracking-widest flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--c-bg-elevated)] flex items-center justify-center border border-[var(--c-danger)]/30 shadow-[0_0_15px_rgb(168_85_247_/_0.2)]">
                                <AlertTriangle className="w-4 h-4 text-[var(--c-danger)]" />
                              </div>
                              PROBLEMAS / DOLORES
                            </h3>
                            <ul className="flex flex-col gap-5">
                              {weaknesses.map((w, i) => (
                                <li
                                  key={i}
                                  className="text-[15px] leading-relaxed font-medium text-[var(--c-text-primary)] flex items-start gap-4 bg-[var(--c-bg-elevated)] p-6 rounded-[var(--r-xl)] border border-[var(--c-border-strong)] shadow-tactile hover:border-[var(--c-danger)]/50 transition-colors"
                                >
                                  <div className="w-2 h-2 rounded-full bg-[var(--c-danger)] mt-2 shrink-0 shadow-[0_0_10px_rgb(168_85_247_/_0.8)]" />
                                  {w as string}
                                </li>
                              ))}
                              {weaknesses.length === 0 && (
                                <span className="text-[14px] font-bold text-[var(--c-text-tertiary)] p-4">
                                  Sin dolores identificados.
                                </span>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Opportunities and Recommended Services */}
                        <div className="flex flex-col gap-8 pb-10">
                          <h3 className="text-[12px] font-bold text-[var(--c-accent)] uppercase tracking-widest flex items-center gap-3 drop-shadow-[0_0_8px_rgb(99_102_241_/_0.5)]">
                            <div className="w-8 h-8 rounded-full bg-[var(--c-bg-elevated)] flex items-center justify-center border border-[var(--c-accent)] shadow-[0_0_15px_rgb(99_102_241_/_0.4)]">
                              <Lightbulb className="w-4 h-4 text-[var(--c-accent)]" />
                            </div>
                            SERVICIOS RECOMENDADOS & OPORTUNIDADES
                          </h3>
                          <div className="grid grid-cols-1 gap-6">
                            {opportunities.length > 0 ? (
                              opportunities.map((opp: Record<string, unknown>, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col md:flex-row gap-6 p-10 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile hover:shadow-glow hover:border-[var(--c-accent-border)] transition-all group"
                                >
                                  <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex items-center gap-5">
                                      <span className="text-[18px] font-black text-[var(--c-text-primary)] capitalize group-hover:text-[var(--c-accent)] transition-colors">
                                        {typeof opp.type === "string"
                                          ? opp.type.replace(/_/g, " ")
                                          : "Oportunidad"}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-[11px] py-1.5 px-4 bg-[var(--c-bg-base)] border-[var(--c-accent-border)] text-[var(--c-accent)] shadow-[0_0_12px_rgb(99_102_241_/_0.15)] font-black tracking-widest"
                                      >
                                        SOLUCIÓN
                                      </Badge>
                                    </div>
                                    <p className="text-[15px] text-[var(--c-text-secondary)] leading-relaxed font-medium mt-1">
                                      <span className="font-bold text-[var(--c-text-primary)] uppercase tracking-widest text-[12px] mr-3">
                                        Por qué lo necesitan:
                                      </span>
                                      {typeof opp.description === "string" ? opp.description : ""}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span className="text-[14px] font-bold text-[var(--c-text-tertiary)] p-4">
                                No se identificaron oportunidades claras.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : prospect.analysisStatus === "IN_PROGRESS" || isAnalyzing ? (
                      <div className="flex flex-col flex-1 justify-between py-12">
                        <div className="flex flex-col gap-16 animate-pulse opacity-70 mb-16 relative z-10 w-full max-w-5xl mx-auto">
                          {/* Summary & Metrics Skeleton */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
                              <Skeleton className="h-5 w-48 rounded-[var(--r-md)] bg-[var(--c-border-strong)]" />
                              <div className="flex flex-col gap-5 p-8 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]">
                                <Skeleton className="h-6 w-full rounded bg-[var(--c-bg-base)]" />
                                <Skeleton className="h-6 w-11/12 rounded bg-[var(--c-bg-base)]" />
                                <Skeleton className="h-6 w-4/5 rounded bg-[var(--c-bg-base)]" />
                              </div>
                            </div>
                            <div className="col-span-1 flex flex-col gap-6 p-8 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]">
                              <Skeleton className="h-16 w-full rounded bg-[var(--c-bg-base)]" />
                              <div className="w-full h-[1px] bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-16 w-full rounded bg-[var(--c-bg-base)]" />
                            </div>
                          </div>

                          {/* Signals Grid Skeleton */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="flex flex-col gap-6">
                              <Skeleton className="h-5 w-40 rounded-[var(--r-md)] bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-20 w-full rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                              <Skeleton className="h-20 w-full rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                            </div>
                            <div className="flex flex-col gap-6">
                              <Skeleton className="h-5 w-48 rounded-[var(--r-md)] bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-20 w-full rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                              <Skeleton className="h-20 w-full rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)]" />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center relative z-10 mt-auto">
                          <Button
                            disabled={true}
                            className="w-full max-w-md rounded-[var(--r-full)] bg-[var(--c-bg-elevated)] border-[var(--c-accent)] text-[var(--c-accent)] shadow-[0_0_20px_rgb(99_102_241_/_0.3)] opacity-80 py-8 text-[15px]"
                          >
                            <Sparkles className="w-6 h-6 mr-4 text-[var(--c-accent)] animate-pulse" />
                            ANALIZANDO CON AXIOM IA...
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto py-24 relative z-10 w-full min-h-[500px]">
                        <div
                          className="w-24 h-24 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile flex items-center justify-center mb-10 relative group cursor-pointer hover:shadow-glow hover:border-[var(--c-accent-border)] transition-all"
                          onClick={handleAnalyze}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--c-accent)]/10 to-transparent rounded-[var(--r-2xl)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Wand2 className="w-10 h-10 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors drop-shadow-[0_0_8px_rgb(99_102_241_/_0)] group-hover:drop-shadow-[0_0_12px_rgb(99_102_241_/_0.8)]" />
                        </div>
                        <p className="text-[28px] font-black tracking-tight text-[var(--c-text-primary)] mb-5 drop-shadow-[0_0_8px_rgb(230_232_238_/_0.15)]">
                          Sin Inteligencia Comercial
                        </p>
                        <p className="text-[16px] font-medium text-[var(--c-text-secondary)] leading-relaxed mb-12 px-8">
                          Ejecuta el motor de IA para descubrir los dolores del negocio, extraer el
                          Score IA y recomendar soluciones precisas.
                        </p>
                        <Button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="w-full max-w-[320px] rounded-[var(--r-full)] bg-[var(--c-bg-elevated)] border border-[var(--c-accent)] text-[var(--c-accent)] shadow-[0_0_20px_rgb(99_102_241_/_0.3)] hover:shadow-[0_0_30px_rgb(99_102_241_/_0.6)] hover:bg-[var(--c-accent)]/10 font-black tracking-widest transition-all py-8 text-[15px]"
                        >
                          <Sparkles className="w-6 h-6 mr-3" />
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
                    <div className="flex flex-col gap-10 relative z-10 w-full max-w-5xl mx-auto">
                      <div className="flex items-center justify-between p-8 rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile">
                        <div className="flex flex-col gap-2.5">
                          <h3 className="text-[18px] font-black tracking-tight text-[var(--c-text-primary)] drop-shadow-[0_0_8px_rgb(230_232_238_/_0.15)]">
                            Cold Email & Propuesta
                          </h3>
                          <p className="text-[14px] font-medium text-[var(--c-text-tertiary)]">
                            Basado en los dolores descubiertos en el análisis.
                          </p>
                        </div>
                        <div className="flex items-center gap-5">
                          {prospect.messageDraft && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={handleCopyDraft}
                              className="rounded-[var(--r-full)] text-[13px] font-bold border border-[var(--c-border-strong)] shadow-sm hover:border-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] transition-all bg-[var(--c-bg-base)] px-6 py-5"
                            >
                              <Copy className="w-4 h-4 mr-2" /> Copiar
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleGenerateProposal}
                            disabled={isGenerating || prospect.analysisStatus !== "COMPLETED"}
                            className="rounded-[var(--r-full)] text-[13px] font-black tracking-wide bg-[var(--c-accent)] text-[var(--c-bg-base)] border-none shadow-[0_0_20px_rgb(99_102_241_/_0.4)] hover:shadow-[0_0_30px_rgb(99_102_241_/_0.7)] hover:bg-[var(--c-primary)] transition-all px-8 py-5"
                          >
                            {isGenerating ? (
                              <RefreshCw className="w-5 h-5 mr-2.5 animate-spin text-[var(--c-bg-base)]" />
                            ) : prospect.messageDraft ? (
                              <RefreshCw className="w-5 h-5 mr-2.5 text-[var(--c-bg-base)]" />
                            ) : (
                              <PenLine className="w-5 h-5 mr-2.5 text-[var(--c-bg-base)]" />
                            )}
                            {prospect.messageDraft ? "Regenerar" : "Redactar (IA)"}
                          </Button>
                        </div>
                      </div>

                      {prospect.messageDraft ? (
                        <div className="flex flex-col gap-5">
                          <Textarea
                            className="min-h-[500px] text-[16px] leading-relaxed font-medium font-sans resize-y bg-[var(--c-bg-elevated)] border-[var(--c-border-strong)] rounded-[var(--r-2xl)] shadow-inner p-10 focus-visible:ring-[var(--c-accent)] focus-visible:border-[var(--c-accent)] transition-all text-[var(--c-text-primary)]"
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Tu propuesta aparecerá aquí..."
                          />
                          <p className="text-[12px] font-bold tracking-widest text-[var(--c-text-tertiary)] text-right px-4">
                            * PUEDES EDITAR EL TEXTO DIRECTAMENTE ANTES DE COPIARLO. CREADO POR{" "}
                            <span className="text-[var(--c-accent)]">
                              {prospect.messageDraftModel}
                            </span>
                            .
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-[var(--c-border-strong)] rounded-[var(--r-2xl)] bg-[var(--c-bg-elevated)]/50 backdrop-blur-sm shadow-inner group">
                          <div className="w-24 h-24 rounded-full bg-[var(--c-bg-base)] flex items-center justify-center mb-8 shadow-tactile border border-[var(--c-border-strong)] group-hover:border-[var(--c-accent-border)] transition-colors">
                            <MessageSquare className="w-10 h-10 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors" />
                          </div>
                          <p className="text-[16px] font-medium text-[var(--c-text-secondary)] mb-5 max-w-[450px] leading-relaxed">
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
          <SidePanelFooter className="justify-between items-center border-t border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)]/95 backdrop-blur-2xl py-8 px-12 shadow-[0_-15px_50px_rgb(11_13_18_/_0.8)] z-20 relative">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] font-bold tracking-widest rounded-[var(--r-full)] hover:bg-[var(--c-bg-subtle)] transition-all px-8 py-6 text-[14px]"
            >
              Cerrar
            </Button>
            <div className="flex items-center gap-5">
              <Button
                onClick={() => setActiveTab("outreach")}
                disabled={activeTab === "outreach"}
                variant="secondary"
                className="font-bold tracking-widest rounded-[var(--r-full)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] hover:border-[var(--c-text-secondary)] transition-all px-8 py-6 text-[14px]"
              >
                Ver Propuesta
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || prospect.analysisStatus === "IN_PROGRESS"}
                className="font-bold tracking-widest rounded-[var(--r-full)] bg-[var(--c-bg-base)] border border-[var(--c-border-strong)] hover:border-[var(--c-accent)] text-[var(--c-text-primary)] hover:text-[var(--c-accent)] hover:shadow-[0_0_20px_rgb(99_102_241_/_0.3)] transition-all px-8 py-6 text-[14px]"
              >
                {prospect.analysisStatus === "COMPLETED" ? "Re-analizar" : "Analizar Prospecto"}
                <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
              <Button
                onClick={handleConvertToLead}
                disabled={
                  isConverting ||
                  Boolean(prospect.convertedToLeadId) ||
                  prospect.analysisStatus !== "COMPLETED" ||
                  !draftContent.trim()
                }
                className="font-black tracking-wide rounded-[var(--r-full)] bg-[var(--c-success)] text-[var(--c-bg-base)] border-none shadow-[0_0_24px_rgb(34_211_238_/_0.5)] hover:shadow-[0_0_36px_rgb(34_211_238_/_0.8)] hover:bg-[var(--c-primary)] transition-all disabled:opacity-50 disabled:shadow-none px-10 py-6 ml-3 text-[14px]"
              >
                {isConverting ? (
                  <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                )}
                CONFIRMAR & ENVIAR A CRM
              </Button>
            </div>
          </SidePanelFooter>
        </>
      )}
    </SidePanel>
  );
}
