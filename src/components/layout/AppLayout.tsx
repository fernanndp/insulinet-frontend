import type {
  ReactNode,
} from "react";

import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
  userName?: string;
};

export default function AppLayout({
  children,
  userName,
}: Props) {
  return (
    <div className="app-shell">
      <Sidebar
        userName={userName}
      />

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}