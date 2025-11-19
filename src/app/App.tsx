import { Outlet } from "react-router-dom";

export function App() {
  return (
    <div className="min-h-screen ">
      <main className="pb-6">
        <Outlet />
      </main>
    </div>
  );
}
