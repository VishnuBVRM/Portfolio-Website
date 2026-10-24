import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import {
  X,
  Server,
  Database,
  Code2,
  Terminal,
  ExternalLink,
  Github,
  Zap,
  CheckCircle,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Table
} from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'features'>('architecture');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                {project.category}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {project.coreStack.backend} • {project.coreStack.database}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {project.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Core Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/50 shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Architecture & Request Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>MySQL Schema & Indexing ({project.schemaHighlights.length} tables)</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'features'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Key Engineering Highlights</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Tech Stack Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-sans">Frontend</span>
              <div className="font-semibold text-sky-400">{project.coreStack.frontend}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-sans">Backend Core</span>
              <div className="font-semibold text-emerald-400">{project.coreStack.backend}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-sans">Java Platform</span>
              <div className="font-semibold text-indigo-400">{project.coreStack.javaVersion}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-sans">Database Engine</span>
              <div className="font-semibold text-amber-400">{project.coreStack.database}</div>
            </div>
          </div>

          {/* TAB 1: System Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>Distributed Pipeline Architecture</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.architectureOverview}
                </p>
              </div>

              {/* Step By Step Architecture Flow Diagram */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 font-mono uppercase">
                  End-to-End Processing Flow:
                </span>
                <div className="space-y-2.5">
                  {project.architectureSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          {step.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem Solved */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs">
                <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5 font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bottlenecks & Problem Solved:</span>
                </div>
                <div className="text-slate-300 leading-relaxed">
                  {project.problemSolved}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MySQL Schema Explorer */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>MySQL Relational Data Architecture & Indexes</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Engineered for strict ACID compliance, MVCC row-level isolation, and index coverage to prevent table scans under heavy concurrent reads/writes.
                </p>
              </div>

              <div className="space-y-4">
                {project.schemaHighlights.map((table) => (
                  <div
                    key={table.tableName}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-amber-400" />
                        <span className="font-mono font-bold text-white text-sm">
                          {table.tableName}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        Storage Engine: InnoDB
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic">
                      {table.purpose}
                    </p>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                        Columns Definition:
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-0.5 overflow-x-auto">
                        {table.columns.map((col, i) => (
                          <div key={i} className="whitespace-nowrap">
                            <span className="text-indigo-400">•</span> {col}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="text-[10px] font-mono uppercase text-amber-400/90 font-semibold mb-1">
                        Keys & Indexes:
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 font-mono text-[11px] text-amber-200 overflow-x-auto">
                        {table.keys}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Features & Metrics */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Quantified Metrics */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
                  Production Benchmarks & Metrics:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/20 flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">
                        {metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
                  Engineered Feature Set:
                </h4>
                <div className="space-y-2">
                  {project.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Stack Badges */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
                  All Libraries & Tools:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            Architected & Built by Vishnu Vardhan
          </div>
          <div className="flex items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              Done Viewing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
