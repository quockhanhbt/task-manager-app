const apiBase = import.meta.env.VITE_API_URL ?? '';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const params  = new URLSearchParams(window.location.search);
  const error   = params.get('error');
  const details = params.get('details');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-sm text-center">

        {/* Logo */}
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="13" y="9"     width="11" height="2.5" rx="1.25" fill="white" opacity="0.9"/>
            <rect x="13" y="14.75" width="11" height="2.5" rx="1.25" fill="white" opacity="0.9"/>
            <rect x="13" y="20.5"  width="7"  height="2.5" rx="1.25" fill="white" opacity="0.9"/>
            <polyline points="8,11 9.8,13 12.5,9"            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="8,16.75 9.8,18.75 12.5,14.75"  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="21.75" r="2" stroke="white" strokeWidth="1.8" opacity="0.6"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Task Manager</h1>
        <p className="text-gray-500 text-sm mb-8">Sign in to manage your tasks</p>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-red-600 text-xs font-semibold">Login failed: {error}</p>
            {details && <p className="text-red-400 text-xs mt-1 break-all">{details}</p>}
          </div>
        )}

        {/* Debug: show VITE_API_URL */}
        {!apiBase && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
            <p className="text-yellow-700 text-xs font-semibold">Config issue: VITE_API_URL is not set.</p>
            <p className="text-yellow-600 text-xs mt-1">Add it to your frontend Vercel environment variables.</p>
          </div>
        )}

        <a
          href={`${apiBase}/auth/google`}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </a>
      </div>
    </div>
  );
}
