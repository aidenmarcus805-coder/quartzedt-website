import React from 'react';
import clsx from 'clsx';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface OperationalIssueProps {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  onDismiss?: () => void;
}

export function OperationalIssue({ severity, message, onDismiss }: OperationalIssueProps) {
  const styles = {
    critical: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: 'text-red-500',
      border: 'border-red-200',
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: 'text-yellow-500',
      border: 'border-yellow-200',
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      icon: 'text-blue-500',
      border: 'border-blue-200',
    },
  };

  const style = styles[severity];
  const Icon = severity === 'critical' ? AlertCircle : severity === 'warning' ? AlertTriangle : Info;

  return (
    <div className={clsx("rounded-md border p-4", style.bg, style.border)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={clsx("h-5 w-5", style.icon)} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={clsx("text-sm font-medium", style.text)}>{message}</p>
          {onDismiss && (
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <button
                type="button"
                className={clsx("whitespace-nowrap font-medium hover:underline", style.text)}
                onClick={onDismiss}
              >
                Dismiss
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
