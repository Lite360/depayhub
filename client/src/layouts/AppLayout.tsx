import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';

export const AppLayout = () => {
  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto relative bg-background shadow-2xl overflow-hidden">
      <Outlet />
      <BottomNav />
    </div>
  );
};
