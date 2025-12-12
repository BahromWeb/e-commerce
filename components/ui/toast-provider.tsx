"use client";

import { ReactNode } from "react";
import { message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useToast() {
  const [messageApi, contextHolder] = message.useMessage();

  const showToast = (msg: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const icons = {
      success: <CheckCircleOutlined />,
      error: <CloseCircleOutlined />,
      info: <InfoCircleOutlined />,
      warning: <WarningOutlined />,
    };

    messageApi.open({
      type,
      content: msg,
      icon: icons[type],
      duration: 3,
    });
  };

  return { showToast, contextHolder };
}
