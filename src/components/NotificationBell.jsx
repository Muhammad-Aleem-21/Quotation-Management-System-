import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiX, FiXCircle, FiClock, FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import {
  getNotifications,
  getNotificationStats,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../api/api";

// Map notification type/status to icon & color
const getNotificationMeta = (notification) => {
  const type = (notification.type || notification.data?.type || "").toLowerCase();
  const message = (notification.message || notification.data?.message || "").toLowerCase();

  // Duplicate quotation alerts
  if (type.includes("duplicate_quotation") || type.includes("duplicate")) {
    const alertLevel = notification.data?.alert_level || "";
    if (alertLevel === "high" || notification.data?.critical) {
      return { icon: <FiAlertCircle />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" };
    }
    return { icon: <FiAlertTriangle />, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" };
  }

  if (type.includes("approved") || type.includes("accepted") || message.includes("approved") || message.includes("accepted")) {
    return { icon: <FiCheckCircle />, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" };
  }
  if (type.includes("rejected") || message.includes("rejected")) {
    return { icon: <FiXCircle />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" };
  }
  if (type.includes("submitted") || type.includes("new") || message.includes("submitted") || message.includes("new quotation")) {
    return { icon: <FiClock />, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" };
  }
  return { icon: <FiAlertCircle />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" };
};

// Format notification time as relative or absolute (converts UTC from backend → local device time)
const formatNotificationTime = (notification) => {
  const timestamp = notification.created_at || notification.updated_at || notification.data?.created_at;
  if (!timestamp) return '';

  // Ensure UTC interpretation if no timezone indicator is present
  let normalized = String(timestamp).trim();
  if (!/Z|[+-]\d{2}:\d{2}$/.test(normalized)) {
    normalized = normalized.replace(' ', 'T') + 'Z';
  }

  const date = new Date(normalized);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi',   // ← add this
  });
};

// Determine target route based on role
const getTargetRoute = (notification) => {
  const role = localStorage.getItem("role") || "";
  const quotationId = notification.notifiable_id || notification.quotation_id || notification.data?.quotation_id || notification.data?.new_quotation?.id || "";
  const type = (notification.type || notification.data?.type || "").toLowerCase();
  const message = (notification.message || notification.data?.message || "").toLowerCase();

  const highlightParam = quotationId ? `?highlight=${quotationId}` : "";

  // Duplicate alerts route to pending page for review
  if (type.includes("duplicate_quotation") || type.includes("duplicate")) {
    switch (role) {
      case "super-admin":
        return `/pending-list${highlightParam}`;
      case "admin":
        return `/admin/pending${highlightParam}`;
      case "manager":
        return `/manager/pending${highlightParam}`;
      default:
        return `/my-quotation${highlightParam}`;
    }
  }
  
  const isApproved = type.includes("approved") || type.includes("accepted") || message.includes("approved") || message.includes("accepted");
  const isRejected = type.includes("rejected") || message.includes("rejected");

  switch (role) {
    case "salesperson":
      return `/my-quotation${highlightParam}`;
    case "manager":
      if (isApproved) return `/active-quotations${highlightParam}`;
      if (isRejected) return `/manager/rejected${highlightParam}`;
      return `/manager/pending${highlightParam}`;
    case "admin":
      if (isApproved) return `/admin/approved${highlightParam}`;
      if (isRejected) return `/admin/rejected${highlightParam}`;
      return `/admin/pending${highlightParam}`;
    case "super-admin":
      if (isApproved) return `/accepted-list${highlightParam}`;
      if (isRejected) return `/rejected-list${highlightParam}`;
      return `/pending-list${highlightParam}`;
    default:
      return "/";
  }
};

export default function NotificationBell({ inline = false }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // tracks which notification ID is being acted on
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const [notifRes, statsRes] = await Promise.all([
        getNotifications(),
        getNotificationStats(),
      ]);

      const notifData = notifRes.data?.data || notifRes.data?.notifications || notifRes.data || [];
      setNotifications(Array.isArray(notifData) ? notifData : []);

      const stats = statsRes.data?.data || statsRes.data;
      setUnreadCount(stats?.unread_count ?? stats?.unread ?? notifData.filter((n) => !n.read_at).length);
    } catch (err) {
      console.warn("Failed to fetch notifications:", err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Handle click on a notification => mark read + navigate
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await markNotificationRead(notification.id);
      }
    } catch (err) {
      console.warn("Error marking notification read:", err.message);
    }
    setOpen(false);
    const target = getTargetRoute(notification);
    navigate(target);
    // Re-fetch
    setTimeout(fetchNotifications, 500);
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      setActionLoading("markAll");
      await markAllNotificationsRead();
      await fetchNotifications();
    } catch (err) {
      console.warn("Error marking all as read:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Clear all
  const handleClearAll = async () => {
    try {
      setActionLoading("clearAll");
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.warn("Error clearing notifications:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete single
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      setActionLoading(id);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn("Error deleting notification:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={inline ? "notification-bell-inline" : "notification-bell-container"}>
      {/* Bell Button */}
      <button
        ref={bellRef}
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
        className="notification-bell-btn"
        title="Notifications"
        id="notification-bell"
      >
        <FiBell className="text-xl text-gray-300 group-hover:text-white transition-colors" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          ref={dropdownRef}
          className="notification-dropdown"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
            >
              <FiX className="text-sm" />
            </button>
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700/40">
              <button
                onClick={handleMarkAllRead}
                disabled={actionLoading === "markAll"}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
              >
                <FiCheck className="text-xs" />
                {actionLoading === "markAll" ? "Marking..." : "Mark all read"}
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={handleClearAll}
                disabled={actionLoading === "clearAll"}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                <FiTrash2 className="text-xs" />
                {actionLoading === "clearAll" ? "Clearing..." : "Clear all"}
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="notification-list">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-8 px-4">
                <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mb-3">
                  <FiBell className="text-gray-500 text-xl" />
                </div>
                <p className="text-gray-400 text-sm font-medium">No notifications</p>
                <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification, idx) => {
                const meta = getNotificationMeta(notification);
                const isUnread = !notification.read_at;

                return (
                  <div
                    key={notification.id || idx}
                    onClick={() => handleNotificationClick(notification)}
                    className={`notification-item group ${isUnread ? "notification-unread" : ""}`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center ${meta.color}`}>
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${isUnread ? "text-white font-medium" : "text-gray-300"}`}>
                        {notification.title || notification.message || notification.data?.message || "New notification"}
                      </p>
                      {formatNotificationTime(notification) && (
                        <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <FiClock className="text-[9px]" />
                          {formatNotificationTime(notification)}
                        </p>
                      )}
                    </div>

                    {/* Unread dot + Delete */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isUnread && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      )}
                      <button
                        onClick={(e) => handleDelete(e, notification.id)}
                        disabled={actionLoading === notification.id}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        {actionLoading === notification.id ? (
                          <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiX className="text-xs" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
