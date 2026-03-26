import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

// Profile completion percentage
const calcCompletion = (profileData) => {
  if (!profileData) return 0;
  const fields = ["firstName", "lastName", "phone", "username", "role", "bio"];
  const filled = fields.filter((f) => profileData[f] && profileData[f] !== "").length;
  return Math.round((filled / fields.length) * 100);
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast.info("Logged out", "See you next time!");
    navigate("/login");
  };

  const profileComplete = user?.profileCompleted;
  const completionPct = calcCompletion(user?.profileData);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">SA</span>
          </div>
          <span className="font-semibold text-gray-800">Stepper Auth</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 font-medium hidden sm:block">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{user?.email}</p>
        </div>

        {!profileComplete && (
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl p-6 mb-8 flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
                ⚡
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Complete Your Profile</h3>
                <p className="text-white/80 text-sm mt-0.5">
                  Fill in the registration form to unlock all features
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/30 rounded-full max-w-[140px]">
                    <div
                      className="h-1.5 bg-white rounded-full transition-all"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/80">{completionPct}% done</span>
                </div>
              </div>
            </div>
            <Link
              to="/stepper-form"
              className="shrink-0 bg-white text-orange-600 hover:bg-orange-50 font-semibold px-5 py-2.5 rounded-xl transition text-sm shadow"
            >
              Complete Now →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">👤</div>
              {profileComplete ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">✅ Verified</span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">Incomplete</span>
              )}
            </div>
            <h2 className="font-semibold text-gray-800 text-lg mb-3">Profile Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="font-medium text-gray-700">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-gray-700">{user?.email}</span>
              </div>
              {profileComplete && user?.profileData && (
                <>
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Username</span>
                      <span className="font-medium text-gray-700">@{user.profileData.username}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-400">Role</span>
                      <span className="inline-block capitalize bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {user.profileData.role}
                      </span>
                    </div>
                    {user.profileData.phone && (
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400">Phone</span>
                        <span className="font-medium text-gray-700">{user.profileData.phone}</span>
                      </div>
                    )}
                    {user.profileData.bio && (
                      <p className="text-gray-500 text-xs mt-2 italic border-t border-gray-100 pt-2">
                        "{user.profileData.bio}"
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={`bg-white rounded-2xl shadow-sm border p-6 ${profileComplete ? "border-green-200" : "border-orange-200"}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${profileComplete ? "bg-green-100" : "bg-orange-100"}`}>
                {profileComplete ? "✅" : "📋"}
              </div>
              {profileComplete ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Completed</span>
              ) : (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium animate-pulse">Action Required</span>
              )}
            </div>
            <h2 className="font-semibold text-gray-800 text-lg mb-1">
              {profileComplete ? "Profile Registered" : "Registration Form"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {profileComplete
                ? "Your 3-step registration form has been submitted securely."
                : "Fill the 3-step form to complete your profile registration."}
            </p>
            {profileComplete ? (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                <span>🔐</span>
                <span>Your Data is End To End Encrypted</span>
              </div>
            ) : (
              <Link
                to="/stepper-form"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
              >
                Open Form →
              </Link>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">🛡️</div>
              <h2 className="font-semibold text-gray-800 text-lg">Security Overview</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "🔑", label: "Access Token", detail: "15 min TTL · localStorage" },
                { icon: "🍪", label: "Refresh Token", detail: "7 day TTL · HTTP-only cookie" },
                { icon: "🔐", label: "AES-256", detail: "One-time key per request" },
                { icon: "🚫", label: "XSS + SQLi", detail: "Blocked by middleware" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
