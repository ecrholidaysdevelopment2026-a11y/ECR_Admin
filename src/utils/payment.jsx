import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export const getPaymentBadge = (status) => {
  const statusMap = {
    PENDING: {
      color: "bg-red-100 text-red-800",
      text: "Pending",
      icon: <FiXCircle size={12} />,
    },
    PARTIAL: {
      color: "bg-orange-100 text-orange-800",
      text: "Partial",
      icon: <FiCheckCircle size={12} />,
    },
    PAID: {
      color: "bg-green-100 text-green-800",
      text: "Paid",
      icon: <FiCheckCircle size={12} />,
    },
    REFUNDED: {
      color: "bg-purple-100 text-purple-800",
      text: "Refunded",
      icon: <FiCheckCircle size={12} />,
    },
  };

  const statusInfo = statusMap[status] || {
    color: "bg-gray-100 text-gray-800",
    text: status,
    icon: null,
  };

  return (
    <span
      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
    >
      {statusInfo.icon}
      {statusInfo.text}
    </span>
  );
};

export const getStatusBadge = (status) => {
  const statusMap = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-800",
      text: "Pending",
      icon: <FiXCircle size={12} />,
    },
    CONFIRMED: {
      color: "bg-blue-100 text-blue-800",
      text: "Confirmed",
      icon: <FiCheckCircle size={12} />,
    },
    CHECKED_IN: {
      color: "bg-green-100 text-green-800",
      text: "Checked In",
      icon: <FiCheckCircle size={12} />,
    },
    CHECKED_OUT: {
      color: "bg-purple-100 text-purple-800",
      text: "Checked Out",
      icon: <FiCheckCircle size={12} />,
    },
    CANCELLED: {
      color: "bg-red-100 text-red-800",
      text: "Cancelled",
      icon: <FiXCircle size={12} />,
    },
  };

  const statusInfo = statusMap[status] || {
    color: "bg-gray-100 text-gray-800",
    text: status,
    icon: null,
  };

  return (
    <span
      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
    >
      {statusInfo.icon}
      {statusInfo.text}
    </span>
  );
};
