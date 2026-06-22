import type { ReactNode } from 'react';
import { appUrl } from '@/infra/appUrl';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src={appUrl('icon.png')}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
            aria-hidden
          />
          <h1 className="text-lg font-semibold">Letter Writer</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
