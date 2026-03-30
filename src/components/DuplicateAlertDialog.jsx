import { useState } from "react";
import { FiAlertTriangle, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

/**
 * DuplicateAlertDialog
 * Shows when the backend detects duplicate quotations during submission.
 * Displays same-client, other-client, and similar-amount duplicates.
 * User can cancel or force-submit.
 */
export default function DuplicateAlertDialog({ duplicateData, onCancel, onForceSubmit, isSubmitting }) {
  if (!duplicateData) return null;

  const { same_client = [], other_clients = [], similar_amount = [] } = duplicateData.duplicates || duplicateData || {};
  const alertLevel = duplicateData.alert_level || (same_client.length > 0 ? "high" : "medium");

  const headerColor = alertLevel === "high" ? "from-red-600 to-red-800" : "from-yellow-600 to-orange-700";
  const headerIcon = alertLevel === "high" ? "🔴" : "🟡";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ animation: "fadeIn 0.2s ease-out" }}>
      <div className="bg-gray-800 border border-gray-600 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" style={{ animation: "slideUp 0.3s ease-out" }}>
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${headerColor} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{headerIcon}</span>
            <div>
              <h3 className="text-white font-bold text-lg">Duplicate Quotation Detected</h3>
              <p className="text-white/80 text-sm">Similar quotations already exist in the system</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">

          {/* Same Client Duplicates — CRITICAL */}
          {same_client.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiAlertCircle className="text-red-400 text-lg" />
                <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider">
                  Same Client — {same_client.length} Match{same_client.length > 1 ? "es" : ""}
                </h4>
              </div>
              <p className="text-red-300/70 text-xs mb-3">
                These quotations were created for the same client with similar products. Super Admin, Admin, and Manager will be notified.
              </p>
              <div className="space-y-2">
                {same_client.map((dup, idx) => (
                  <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium text-sm">{dup.quotation_number}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {dup.date} • {dup.items_count || "?"} items • Status: <span className="capitalize">{dup.status}</span>
                      </p>
                    </div>
                    <p className="text-red-300 font-bold text-sm">{dup.formatted_amount || `Rs. ${parseFloat(dup.amount || 0).toLocaleString()}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Clients Duplicates — WARNING */}
          {other_clients.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiAlertTriangle className="text-yellow-400 text-lg" />
                <h4 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                  Different Client — {other_clients.length} Match{other_clients.length > 1 ? "es" : ""}
                </h4>
              </div>
              <p className="text-yellow-300/70 text-xs mb-3">
                These quotations have the same products but for different clients. Manager and Admin will be notified.
              </p>
              <div className="space-y-2">
                {other_clients.map((dup, idx) => (
                  <div key={idx} className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium text-sm">{dup.quotation_number}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Client: <span className="text-yellow-300">{dup.client}</span> • {dup.date}
                      </p>
                    </div>
                    <p className="text-yellow-300 font-bold text-sm">{dup.formatted_amount || `Rs. ${parseFloat(dup.amount || 0).toLocaleString()}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Amount — INFO */}
          {similar_amount.length > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiInfo className="text-orange-400 text-lg" />
                <h4 className="text-orange-400 font-bold text-sm uppercase tracking-wider">
                  Similar Amount — {similar_amount.length} Match{similar_amount.length > 1 ? "es" : ""}
                </h4>
              </div>
              <p className="text-orange-300/70 text-xs mb-3">
                These quotations have a similar total amount. Manager will be notified.
              </p>
              <div className="space-y-2">
                {similar_amount.map((dup, idx) => (
                  <div key={idx} className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium text-sm">{dup.quotation_number}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Client: <span className="text-orange-300">{dup.client}</span>
                      </p>
                    </div>
                    <p className="text-orange-300 font-bold text-sm">{dup.formatted_amount || `Rs. ${parseFloat(dup.amount || 0).toLocaleString()}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              <strong className="text-white">ℹ️ This quotation has already been saved.</strong>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              The duplicate was detected and the quotation was flagged for review. Click <strong className="text-white">OK</strong> to close this notice.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/80 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            OK
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: a(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
