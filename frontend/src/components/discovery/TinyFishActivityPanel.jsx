import React from 'react'
import { Activity, Globe, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react'

export default function TinyFishActivityPanel({ activeTask, taskHistory }) {
  return (
    <div className="bg-navy-900 text-white rounded-2xl p-6 shadow-md mb-8">
      <div className="flex items-center justify-between pb-4 border-b border-navy-700 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide">TinyFish Autonomous Web Intelligence</h3>
            <p className="text-xs text-gray-400">Real-time web discovery & data extraction engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
            ● Live Engine Active
          </span>
        </div>
      </div>

      {activeTask && (
        <div className="bg-navy-800/80 rounded-xl p-4 border border-navy-700/60 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-teal-300 font-mono uppercase tracking-wider">
              {activeTask.task_type} in progress
            </span>
            <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-200 mb-1">{activeTask.query}</p>
          <div className="w-full bg-navy-900 rounded-full h-1.5 overflow-hidden mt-3">
            <div className="bg-gradient-to-r from-teal-400 to-teal-200 h-full w-2/3 animate-pulse rounded-full" />
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5" /> Recent Autonomous Discovery Runs
        </h4>

        {(!taskHistory || taskHistory.length === 0) ? (
          <p className="text-xs text-gray-500 italic">No tasks executed in this session yet.</p>
        ) : (
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {taskHistory.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-navy-800/40 hover:bg-navy-800/70 p-3 rounded-lg border border-navy-700/40 text-xs transition-all"
              >
                <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : task.status === 'failed' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-teal-400 animate-spin shrink-0" />
                  )}
                  <span className="font-mono text-gray-300 truncate">{task.query}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-gray-400">
                  {task.duration_seconds && <span>{task.duration_seconds}s</span>}
                  <span
                    className={`capitalize font-medium ${
                      task.status === 'completed'
                        ? 'text-emerald-400'
                        : task.status === 'failed'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
