import { PublicHeader } from '../components/PublicHeader';

export const FAQ = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <PublicHeader />
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">FAQ</h1>
        <p className="text-lg text-slate-600">Our FAQ page content will go here.</p>
      </main>
    </div>
  );
};
