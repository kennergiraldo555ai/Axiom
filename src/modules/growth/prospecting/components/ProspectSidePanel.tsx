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
  Mail,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowRight,
  Activity,
  TrendingUp,
  Star,
} from "lucide-react";
import type { ProspectEntity } from "../domain/entities/prospect.entity";
import { analyzeProspectAction } from "../presentation/actions";
import { toast } from "sonner";

interface ProspectSidePanelProps {
  prospect: ProspectEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function ProspectSidePanel({ prospect, isOpen, onClose, onUpdate }: ProspectSidePanelProps) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAnalyze = async () => {
    if (!prospect) return;
    setIsAnalyzing(true);
    const loadingToast = toast.loading(`Analyzing ${prospect.name}...`);
    try {
      const response = await analyzeProspectAction(prospect.id);
      if (response.success) {
        toast.success("Analysis complete", { id: loadingToast });
        onUpdate();
      } else {
        toast.error("Analysis failed", { description: response.error, id: loadingToast });
      }
    } catch {
      toast.error("Unexpected error", { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scoreRationale = prospect?.scoreRationale as Record<string, unknown> | null;
  const summary = (scoreRationale?.summary as string) || "No summary available.";
  // We mock the granular fields for now, or extract them if they existed in the JSON.
  // In the future, the backend will return exactly these structures.
  const strengths = ["Good location", "High rating"];
  const weaknesses = ["No website detected", "Low review count"];
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--c-bg-subtle)] border border-[var(--c-border-subtle)] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[var(--c-text-secondary)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold tracking-tight leading-none text-[var(--c-text-primary)]">
                    {prospect.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--c-text-tertiary)]">
                      {prospect.categoryId || "Business"}
                    </span>
                    <span className="text-[10px] text-[var(--c-border-strong)]">•</span>
                    <span className="text-[11px] text-[var(--c-text-tertiary)]">
                      {prospect.cityId || "Location"}
                    </span>
                  </div>
                </div>
              </div>
            }
            description={null}
            onClose={onClose}
          />

          <SidePanelBody className="p-0">
            <div className="flex flex-col">
              {/* Header Status Bar */}
              <div className="flex items-center gap-4 px-8 py-4 border-b border-[var(--c-border-subtle)] bg-[var(--c-bg-base)]">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                    Status
                  </span>
                  <Badge
                    variant={prospect.analysisStatus === "COMPLETED" ? "success" : "secondary"}
                  >
                    {prospect.analysisStatus === "COMPLETED" ? "Analyzed" : "Pending Analysis"}
                  </Badge>
                </div>
                {prospect.qualityScore && (
                  <>
                    <div className="w-[1px] h-8 bg-[var(--c-border-subtle)]" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                        Quality Score
                      </span>
                      <span
                        className={`text-sm font-mono font-medium ${prospect.qualityScore >= 80 ? "text-[var(--c-success)]" : prospect.qualityScore >= 50 ? "text-[var(--c-warning)]" : "text-[var(--c-danger)]"}`}
                      >
                        {prospect.qualityScore} / 100
                      </span>
                    </div>
                  </>
                )}
                {prospect.rating && (
                  <>
                    <div className="w-[1px] h-8 bg-[var(--c-border-subtle)]" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--c-text-tertiary)]">
                        Reputation
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--c-text-primary)]">
                        {prospect.rating}{" "}
                        <Star className="w-3.5 h-3.5 fill-[var(--c-warning)] text-[var(--c-warning)]" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--c-border-subtle)]">
                {/* Left Column: CRM Details */}
                <div className="col-span-1 flex flex-col gap-8 p-8 bg-[var(--c-bg-base)]">
                  <section className="flex flex-col gap-4">
                    <h3 className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider">
                      Contact Information
                    </h3>
                    <div className="flex flex-col gap-4 text-[13px]">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[var(--c-text-tertiary)] mt-0.5 shrink-0" />
                        <span className="text-[var(--c-text-primary)] leading-relaxed">
                          {prospect.address || "No address on file"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
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
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-[var(--c-text-tertiary)] shrink-0" />
                        {prospect.website ? (
                          <a
                            href={prospect.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--c-accent)] hover:underline flex items-center gap-1"
                          >
                            {new URL(prospect.website).hostname.replace("www.", "")}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[var(--c-text-tertiary)]">No website</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[var(--c-text-tertiary)] shrink-0" />
                        <span className="text-[var(--c-text-tertiary)]">No email found</span>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: AI Analysis */}
                <div className="col-span-2 flex flex-col p-8 bg-[var(--c-bg-elevated)] min-h-[500px]">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-semibold text-[var(--c-text-primary)] flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[var(--c-accent)]" />
                      Intelligence Analysis
                    </h3>
                    <span className="text-xs font-mono text-[var(--c-text-tertiary)]">
                      {prospect.analyzedAt
                        ? new Date(prospect.analyzedAt).toLocaleDateString()
                        : "Not analyzed"}
                    </span>
                  </div>

                  {prospect.analysisStatus === "COMPLETED" ? (
                    <div className="flex flex-col gap-8">
                      {/* Executive Summary */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider">
                          Executive Summary
                        </span>
                        <p className="text-[13px] text-[var(--c-text-primary)] leading-relaxed">
                          {summary}
                        </p>
                      </div>

                      <div className="w-full h-[1px] bg-[var(--c-border-subtle)]" />

                      {/* Signals Grid */}
                      <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                          <span className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--c-success)]" />{" "}
                            Strengths
                          </span>
                          <ul className="flex flex-col gap-2">
                            {strengths.map((s, i) => (
                              <li
                                key={i}
                                className="text-[13px] text-[var(--c-text-primary)] flex items-start gap-2"
                              >
                                <span className="text-[var(--c-text-tertiary)] mt-0.5">•</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-3">
                          <span className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-[var(--c-warning)]" /> Pain
                            Points
                          </span>
                          <ul className="flex flex-col gap-2">
                            {weaknesses.map((w, i) => (
                              <li
                                key={i}
                                className="text-[13px] text-[var(--c-text-primary)] flex items-start gap-2"
                              >
                                <span className="text-[var(--c-text-tertiary)] mt-0.5">•</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="w-full h-[1px] bg-[var(--c-border-subtle)]" />

                      {/* Opportunities */}
                      <div className="flex flex-col gap-4">
                        <span className="text-[11px] font-semibold text-[var(--c-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-[var(--c-accent)]" /> Sales
                          Opportunities
                        </span>
                        {opportunities.length > 0 ? (
                          <div className="flex flex-col gap-4">
                            {opportunities.map((opp: Record<string, unknown>, i) => (
                              <div
                                key={i}
                                className="flex flex-col gap-1.5 p-4 rounded-[var(--r-md)] bg-[var(--c-bg-subtle)] border border-[var(--c-border-subtle)]"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[13px] font-medium text-[var(--c-text-primary)] capitalize">
                                    {typeof opp.type === "string"
                                      ? opp.type.replace(/_/g, " ")
                                      : "Opportunity"}
                                  </span>
                                  {typeof opp.severity === "string" ? (
                                    <Badge variant="outline" className="text-[10px]">
                                      {opp.severity}
                                    </Badge>
                                  ) : null}
                                </div>
                                <span className="text-xs text-[var(--c-text-secondary)] leading-relaxed">
                                  {typeof opp.description === "string" ? opp.description : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[13px] text-[var(--c-text-tertiary)]">
                            No distinct opportunities identified.
                          </span>
                        )}
                      </div>

                      <div className="w-full h-[1px] bg-[var(--c-border-subtle)]" />

                      {/* Metrics Footer */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase text-[var(--c-text-tertiary)] font-semibold">
                            Priority Level
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--c-text-primary)]">
                            <Activity className="w-4 h-4 text-[var(--c-danger)]" /> High
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase text-[var(--c-text-tertiary)] font-semibold">
                            Win Probability
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--c-text-primary)]">
                            <TrendingUp className="w-4 h-4 text-[var(--c-success)]" /> 75%
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase text-[var(--c-text-tertiary)] font-semibold">
                            Recommended Action
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--c-text-primary)]">
                            <Zap className="w-4 h-4 text-[var(--c-accent)]" /> Cold Email
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : prospect.analysisStatus === "IN_PROGRESS" || isAnalyzing ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-pulse">
                      <Sparkles className="h-8 w-8 text-[var(--c-accent)] mb-4 animate-bounce" />
                      <p className="text-[13px] font-medium text-[var(--c-text-primary)]">
                        Analyzing business profile...
                      </p>
                      <p className="text-xs text-[var(--c-text-tertiary)] mt-1.5">
                        Evaluating online presence and reputation signals.
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-[var(--c-bg-subtle)] flex items-center justify-center mb-4">
                        <SearchIcon className="w-5 h-5 text-[var(--c-text-tertiary)]" />
                      </div>
                      <p className="text-[13px] font-medium text-[var(--c-text-primary)] mb-1">
                        Intelligence Not Available
                      </p>
                      <p className="text-[13px] text-[var(--c-text-secondary)] leading-relaxed mb-6">
                        Run an AI analysis to uncover pain points, sales opportunities, and get a
                        tailored outreach strategy.
                      </p>
                      <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Run Analysis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SidePanelBody>

          {/* Action Bar Footer */}
          <SidePanelFooter className="justify-between border-t border-[var(--c-border-subtle)] bg-[var(--c-bg-base)] p-4 px-8">
            <Button variant="ghost" onClick={onClose} className="text-[var(--c-text-secondary)]">
              Dismiss
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="secondary">Add Note</Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || prospect.analysisStatus === "IN_PROGRESS"}
              >
                {prospect.analysisStatus === "COMPLETED" ? "Re-analyze" : "Analyze Prospect"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </SidePanelFooter>
        </>
      )}
    </SidePanel>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
