'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserLoginRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to unified login page at /login
    router.replace('/login');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
