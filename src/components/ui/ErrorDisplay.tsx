import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-red-500/30 text-center">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <p className="text-red-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};