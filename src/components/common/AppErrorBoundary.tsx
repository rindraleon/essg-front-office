import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface AppErrorBoundaryProps {
  children: ReactNode;
  resetKey?: string;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur non gérée sur le site ESSG', error, info.componentStack);
  }

  componentDidUpdate(previousProps: AppErrorBoundaryProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-6 text-center animate-fade-in"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 ring-1 ring-danger-100">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h5 font-semibold text-ink-900">Impossible d’afficher cette page</h1>
          <p className="mt-1 max-w-md text-small text-ink-500">
            Un problème est survenu. Rechargez la page pour reprendre votre navigation.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Recharger la page
        </Button>
      </div>
    );
  }
}

export default AppErrorBoundary;
