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
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
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
    <SidePanel isOpen={isOpen} onClose={onClose} width="xl">
      {!prospect ? (
        <div className="flex h-full items-center justify-center p-12">
          <Skeleton className="h-[400px] w-full opacity-50" />
        </div>
      ) : (
        <>
          <SidePanelHeader
            title={
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[var(--r-xl)] bg-gradient-to-br from-[var(--c-bg-subtle)] to-[var(--c-bg-elevated)] border border-[var(--c-border-subtle)] flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-6 h-6 text-[var(--c-text-secondary)]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xl font-semibold tracking-tight leading-none text-[var(--c-text-primary)]">
                    {prospect.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[var(--c-text-secondary)]">
                      {(() => {
                        const m = prospect.metadata as Record<string, unknown> | null;
                        const c = (m?.category as string) || "";
                        return c && c !== "business"
                          ? c.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
                          : "Negocio";
                      })()}
                    </span>
                    <span className="text-[10px] text-[var(--c-border-strong)]">•</span>
                    <span className="text-[12px] text-[var(--c-text-tertiary)]">
                      {prospect.address || "Sin ubicación"}
                    </span>
                  </div>
                </div>
              </div>
            }
            description={null}
            onClose={onClose}
          />

          <SidePanelBody className="p-0">
            <div className="flex flex-col h-full bg-[var(--c-bg-base)]">
              {/* Header Status Bar */}
              <div className="flex flex-wrap items-center gap-6 px-10 py-5 border-b border-[var(--c-border-subtle)] bg-[var(--c-bg-subtle)]/50 backdrop-blur-md">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                    Status
                  </span>
                  <Badge
                    variant={
                      prospect.analysisStatus === "COMPLETED"
                        ? "success"
                        : isAnalyzing
                          ? "warning"
                          : "secondary"
                    }
                    className="px-3"
                  >
                    {isAnalyzing
                      ? "Analizando..."
                      : prospect.analysisStatus === "COMPLETED"
                        ? "Analizado"
                        : "Pendiente"}
                  </Badge>
                </div>
                {prospect.qualityScore && (
                  <>
                    <div className="w-[1px] h-8 bg-[var(--c-border-strong)]" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                        Opportunity Score
                      </span>
                      <span
                        className={`text-sm font-mono font-bold ${prospect.qualityScore >= 80 ? "text-[var(--c-success)]" : prospect.qualityScore >= 50 ? "text-[var(--c-warning)]" : "text-[var(--c-danger)]"}`}
                      >
                        {prospect.qualityScore} / 100
                      </span>
                    </div>
                  </>
                )}
                {prospect.rating && (
                  <>
                    <div className="w-[1px] h-8 bg-[var(--c-border-strong)]" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                        Reputation
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--c-text-primary)]">
                        {prospect.rating}{" "}
                        <Star className="w-3.5 h-3.5 fill-[var(--c-warning)] text-[var(--c-warning)]" />
                      </div>
                    </div>
                  </>
                )}
                {prospect.businessStatus && (
                  <>
                    <div className="w-[1px] h-8 bg-[var(--c-border-strong)] hidden md:block" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                        Operación
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--c-text-primary)]">
                        {prospect.businessStatus === "OPERATIONAL" ? (
                          <span className="text-[var(--c-success)]">Abierto</span>
                        ) : prospect.businessStatus === "CLOSED_TEMPORARILY" ? (
                          <span className="text-[var(--c-warning)]">Cerrado Temp.</span>
                        ) : prospect.businessStatus === "CLOSED_PERMANENTLY" ? (
                          <span className="text-[var(--c-danger)]">Cerrado</span>
                        ) : (
                          prospect.businessStatus
                        )}
                      </div>
                    </div>
                  </>
                )}
                {prospect.analysisStatus === "COMPLETED" && (
                  <>
                    <div className="w-[1px] h-8 bg-[var(--c-border-strong)] hidden md:block" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                        Próximo Paso
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--c-text-primary)]">
                        <Zap className="w-3.5 h-3.5 text-[var(--c-accent)]" />
                        Cold Email (Urgente)
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* CRM Info Row */}
              <div className="flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-4 px-8 py-5 border-b border-[var(--c-border-subtle)] text-[13px]">
                <div className="flex items-start gap-2 max-w-xs">
                  <MapPin className="w-4 h-4 text-[var(--c-text-tertiary)] mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[var(--c-text-secondary)] leading-relaxed">
                      {prospect.address || "No address on file"}
                    </span>
                    {(prospect.googleUrl || (prospect.lat && prospect.lng)) && (
                      <a
                        href={
                          prospect.googleUrl ||
                          `https://www.google.com/maps/search/?api=1&query=${prospect.lat},${prospect.lng}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[var(--c-accent)] hover:underline flex items-center gap-1 w-fit mt-0.5"
                      >
                        Abrir en Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[var(--c-text-tertiary)] shrink-0" />
                    <span
                      className={
                        prospect.phone
                          ? "text-[var(--c-text-primary)]"
                          : "text-[var(--c-text-tertiary)]"
                      }
                    >
                      {prospect.phone || "No phone"}
                    </span>
                  </div>

                  {prospect.website ? (
                    <a
                      href={prospect.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--c-accent)] hover:underline flex items-center gap-1.5"
                    >
                      {prospect.website.toLowerCase().includes("instagram.com") ? (
                        <>
                          <span className="text-[13px]">📷</span> Instagram
                        </>
                      ) : prospect.website.toLowerCase().includes("facebook.com") ? (
                        <>
                          <span className="text-[13px]">👍</span> Facebook
                        </>
                      ) : prospect.website.toLowerCase().includes("tiktok.com") ? (
                        <>
                          <span className="text-[13px]">🎵</span> TikTok
                        </>
                      ) : prospect.website.toLowerCase().includes("whatsapp.com") ||
                        prospect.website.toLowerCase().includes("wa.me") ? (
                        <>
                          <span className="text-[13px]">💬</span> WhatsApp
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 text-[var(--c-text-tertiary)]" /> Sitio Web
                        </>
                      )}
                      <ExternalLink className="w-3 h-3 text-[var(--c-text-tertiary)]" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[var(--c-text-tertiary)] shrink-0" />
                      <span className="text-[var(--c-text-tertiary)]">No website</span>
                    </div>
                  )}
                </div>

                {(() => {
                  const m = prospect.metadata as Record<string, unknown> | null;
                  const hours = m?.hours as string[] | undefined;
                  if (!hours || hours.length === 0) return null;
                  return (
                    <div className="flex items-start gap-2 max-w-[200px]">
                      <Clock className="w-4 h-4 text-[var(--c-text-tertiary)] mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[var(--c-text-secondary)] font-medium">Horario</span>
                        <div className="flex flex-col">
                          {hours.slice(0, 2).map((h, i) => (
                            <span
                              key={i}
                              className="text-[11px] text-[var(--c-text-tertiary)] truncate"
                            >
                              {h}
                            </span>
                          ))}
                          {hours.length > 2 && (
                            <span className="text-[10px] text-[var(--c-text-tertiary)] italic">
                              +{hours.length - 2} más...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Photos Gallery */}
              {(() => {
                const m = prospect.metadata as Record<string, unknown> | null;
                const photos = m?.photos as string[] | undefined;
                if (!photos || photos.length === 0) return null;
                return (
                  <div className="px-8 py-5 border-b border-[var(--c-border-subtle)]">
                    <h4 className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider mb-3">
                      Fotografías ({photos.length})
                    </h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {photos.slice(0, 6).map((photoId, idx) => (
                        <div
                          key={idx}
                          className="w-24 h-24 shrink-0 rounded-[var(--r-md)] border border-[var(--c-border-subtle)] bg-[var(--c-bg-subtle)] overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/places/photo?id=${encodeURIComponent(photoId)}`}
                            alt={`Foto ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
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
              <Tabs className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="px-8 border-b border-[var(--c-border-subtle)] sticky top-0 bg-[var(--c-bg-base)] z-10">
                  <TabsTrigger
                    value="intelligence"
                    active={activeTab === "intelligence"}
                    onClick={() => setActiveTab("intelligence")}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-2 text-[var(--c-accent)]" />
                    AI Intelligence
                  </TabsTrigger>
                  <TabsTrigger
                    value="outreach"
                    active={activeTab === "outreach"}
                    onClick={() => setActiveTab("outreach")}
                  >
                    <MailIcon className="w-3.5 h-3.5 mr-2" />
                    Outreach
                  </TabsTrigger>

                  <div className="w-[1px] h-4 bg-[var(--c-border-strong)] mx-2 hidden sm:block" />

                  {/* Future Architecture Stubs */}
                  <TabsTrigger value="timeline" disabled className="opacity-50">
                    <Clock className="w-3.5 h-3.5 mr-2" /> Timeline
                  </TabsTrigger>
                  <TabsTrigger
                    value="meetings"
                    disabled
                    className="opacity-50 hidden md:inline-flex"
                  >
                    <Briefcase className="w-3.5 h-3.5 mr-2" /> Meetings
                  </TabsTrigger>
                  <TabsTrigger value="tasks" disabled className="opacity-50 hidden lg:inline-flex">
                    <ListTodo className="w-3.5 h-3.5 mr-2" /> Tasks
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto px-8 py-6 bg-[var(--c-bg-elevated)] min-h-[400px]">
                  <TabsContent value="intelligence" active={activeTab === "intelligence"}>
                    {prospect.analysisStatus === "COMPLETED" ? (
                      <div className="flex flex-col gap-10">
                        {/* Summary & Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div className="col-span-1 md:col-span-3 flex flex-col gap-3">
                            <h3 className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider">
                              Executive Summary
                            </h3>
                            <p className="text-[14px] text-[var(--c-text-primary)] leading-relaxed">
                              {summary}
                            </p>
                          </div>
                          <div className="col-span-1 flex flex-col gap-4 p-5 rounded-[var(--r-md)] bg-[var(--c-bg-subtle)] border border-[var(--c-border-subtle)]">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase text-[var(--c-text-tertiary)] font-semibold">
                                Priority
                              </span>
                              <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--c-text-primary)]">
                                <Activity className="w-4 h-4 text-[var(--c-danger)]" /> HIGH
                              </div>
                            </div>
                            <div className="w-full h-[1px] bg-[var(--c-border-strong)]" />
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase text-[var(--c-text-tertiary)] font-semibold">
                                Win Prob
                              </span>
                              <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--c-text-primary)]">
                                <TrendingUp className="w-4 h-4 text-[var(--c-success)]" /> 75%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Signals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex flex-col gap-4">
                            <h3 className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--c-success)]" />
                              Fortalezas
                            </h3>
                            <ul className="flex flex-col gap-3">
                              {strengths.map((s, i) => (
                                <li
                                  key={i}
                                  className="text-[13px] text-[var(--c-text-primary)] flex items-start gap-2 bg-[var(--c-bg-base)] p-3 rounded-[var(--r-sm)] border border-[var(--c-border-subtle)]"
                                >
                                  {s as string}
                                </li>
                              ))}
                              {strengths.length === 0 && (
                                <span className="text-xs text-[var(--c-text-tertiary)]">
                                  Sin fortalezas destacadas.
                                </span>
                              )}
                            </ul>
                          </div>

                          <div className="flex flex-col gap-4">
                            <h3 className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-[var(--c-danger)]" />
                              Problemas / Dolores
                            </h3>
                            <ul className="flex flex-col gap-3">
                              {weaknesses.map((w, i) => (
                                <li
                                  key={i}
                                  className="text-[13px] text-[var(--c-text-primary)] flex items-start gap-2 bg-[var(--c-bg-base)] p-3 rounded-[var(--r-sm)] border border-[var(--c-border-subtle)]"
                                >
                                  {w as string}
                                </li>
                              ))}
                              {weaknesses.length === 0 && (
                                <span className="text-xs text-[var(--c-text-tertiary)]">
                                  Sin dolores identificados.
                                </span>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Opportunities and Recommended Services */}
                        <div className="flex flex-col gap-4">
                          <h3 className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-[var(--c-accent)]" />
                            Servicios Recomendados & Oportunidades
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {opportunities.length > 0 ? (
                              opportunities.map((opp: Record<string, unknown>, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col md:flex-row gap-4 p-5 rounded-[var(--r-md)] bg-[var(--c-bg-base)] border border-[var(--c-border-strong)]"
                                >
                                  <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[13px] font-bold text-[var(--c-text-primary)] capitalize">
                                        {typeof opp.type === "string"
                                          ? opp.type.replace(/_/g, " ")
                                          : "Oportunidad"}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-[9px] bg-[var(--c-bg-subtle)] border-transparent text-[var(--c-text-secondary)]"
                                      >
                                        Solution
                                      </Badge>
                                    </div>
                                    <p className="text-[13px] text-[var(--c-text-secondary)] leading-relaxed">
                                      <span className="font-semibold text-[var(--c-text-primary)]">
                                        Por qué lo necesitan:{" "}
                                      </span>
                                      {typeof opp.description === "string" ? opp.description : ""}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span className="text-[13px] text-[var(--c-text-tertiary)]">
                                No se identificaron oportunidades claras.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : prospect.analysisStatus === "IN_PROGRESS" || isAnalyzing ? (
                      <div className="flex flex-col h-full justify-between">
                        <div className="flex flex-col gap-10 animate-pulse opacity-70 mb-8">
                          {/* Summary & Metrics Skeleton */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
                              <Skeleton className="h-3 w-32 rounded bg-[var(--c-border-strong)]" />
                              <div className="flex flex-col gap-2.5 mt-1">
                                <Skeleton className="h-4 w-full rounded bg-[var(--c-bg-subtle)]" />
                                <Skeleton className="h-4 w-11/12 rounded bg-[var(--c-bg-subtle)]" />
                                <Skeleton className="h-4 w-4/5 rounded bg-[var(--c-bg-subtle)]" />
                              </div>
                            </div>
                            <div className="col-span-1 flex flex-col gap-4 p-5 rounded-[var(--r-md)] bg-[var(--c-bg-subtle)] border border-[var(--c-border-subtle)]">
                              <Skeleton className="h-10 w-full rounded bg-[var(--c-border-subtle)]" />
                              <div className="w-full h-[1px] bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-10 w-full rounded bg-[var(--c-border-subtle)]" />
                            </div>
                          </div>

                          {/* Signals Grid Skeleton */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                              <Skeleton className="h-3 w-28 rounded bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-12 w-full rounded-[var(--r-sm)] bg-[var(--c-bg-subtle)]" />
                              <Skeleton className="h-12 w-full rounded-[var(--r-sm)] bg-[var(--c-bg-subtle)]" />
                            </div>
                            <div className="flex flex-col gap-4">
                              <Skeleton className="h-3 w-36 rounded bg-[var(--c-border-strong)]" />
                              <Skeleton className="h-12 w-full rounded-[var(--r-sm)] bg-[var(--c-bg-subtle)]" />
                              <Skeleton className="h-12 w-full rounded-[var(--r-sm)] bg-[var(--c-bg-subtle)]" />
                            </div>
                          </div>
                        </div>

                        {/* Kept button disabled at the bottom */}
                        <div className="flex justify-center mt-auto">
                          <Button disabled={true} className="w-full max-w-sm">
                            <Sparkles className="w-4 h-4 mr-2 text-[var(--c-accent)] animate-pulse" />
                            Analizando con AXIOM IA...
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12">
                        <div className="w-12 h-12 rounded-full bg-[var(--c-bg-subtle)] flex items-center justify-center mb-4">
                          <Wand2 className="w-5 h-5 text-[var(--c-text-tertiary)]" />
                        </div>
                        <p className="text-[14px] font-medium text-[var(--c-text-primary)] mb-2">
                          Sin Inteligencia Comercial
                        </p>
                        <p className="text-[13px] text-[var(--c-text-secondary)] leading-relaxed mb-6">
                          Ejecuta el motor de IA para descubrir los dolores del negocio, extraer el
                          Opportunity Score y recomendar soluciones precisas.
                        </p>
                        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                          <Sparkles className="w-4 h-4 mr-2 text-[var(--c-accent)]" />
                          Ejecutar Análisis IA
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="outreach" active={activeTab === "outreach"}>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--c-text-primary)]">
                            Cold Email & Propuesta
                          </h3>
                          <p className="text-xs text-[var(--c-text-tertiary)] mt-1">
                            Basado en los dolores descubiertos en el análisis.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {prospect.messageDraft && (
                            <Button variant="secondary" size="sm" onClick={handleCopyDraft}>
                              <Copy className="w-3.5 h-3.5 mr-2" /> Copiar
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleGenerateProposal}
                            disabled={isGenerating || prospect.analysisStatus !== "COMPLETED"}
                          >
                            {isGenerating ? (
                              <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                            ) : prospect.messageDraft ? (
                              <RefreshCw className="w-3.5 h-3.5 mr-2" />
                            ) : (
                              <PenLine className="w-3.5 h-3.5 mr-2" />
                            )}
                            {prospect.messageDraft ? "Regenerar" : "Redactar (IA)"}
                          </Button>
                        </div>
                      </div>

                      {prospect.messageDraft ? (
                        <div className="flex flex-col gap-3">
                          <Textarea
                            className="min-h-[300px] text-[13px] leading-relaxed font-sans resize-y"
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Tu propuesta aparecerá aquí..."
                          />
                          <p className="text-[10px] text-[var(--c-text-tertiary)] text-right">
                            * Puedes editar el texto directamente antes de copiarlo. Creado por{" "}
                            {prospect.messageDraftModel}.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[var(--c-border-strong)] rounded-[var(--r-md)] bg-[var(--c-bg-base)]">
                          <MessageSquare className="w-6 h-6 text-[var(--c-text-tertiary)] mb-3" />
                          <p className="text-[13px] text-[var(--c-text-secondary)] mb-4 max-w-[250px]">
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
          <SidePanelFooter className="justify-between border-t border-[var(--c-border-subtle)] bg-[var(--c-bg-base)] p-4 px-8">
            <Button variant="ghost" onClick={onClose} className="text-[var(--c-text-secondary)]">
              Cerrar
            </Button>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setActiveTab("outreach")}
                disabled={activeTab === "outreach"}
                variant="secondary"
              >
                Ver Propuesta
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || prospect.analysisStatus === "IN_PROGRESS"}
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
              >
                {isConverting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                {prospect.convertedToLeadId ? "Convertido a CRM" : "Convertir a cliente"}
              </Button>
            </div>
          </SidePanelFooter>
        </>
      )}
    </SidePanel>
  );
}
