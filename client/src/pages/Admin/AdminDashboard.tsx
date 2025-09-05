// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Users, 
//   Home, 
//   CreditCard, 
//   MessageSquare, 
//   TrendingUp, 
//   Eye,
//   CheckCircle,
//   XCircle,
//   Clock,
//   BarChart3,
//   Settings,
//   Bell
// } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import api from '../../services/api';

// const AdminDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('overview');

//   const { data: dashboardData, isLoading } = useQuery({
//     queryKey: ['admin-dashboard'],
//     queryFn: async () => {
//       const response = await api.get('/admin/dashboard');
//       return response.data;
//     },
//   });

//   const tabs = [
//     { id: 'overview', name: 'Overview', icon: BarChart3 },
//     { id: 'users', name: 'Users', icon: Users },
//     { id: 'properties', name: 'Properties', icon: Home },
//     { id: 'payments', name: 'Payments', icon: CreditCard },
//     { id: 'contacts', name: 'Messages', icon: MessageSquare },
//   ];

//   const stats = [
//     {
//       name: 'Total Users',
//       value: dashboardData?.users?.total || 0,
//       icon: Users,
//       color: 'blue',
//       change: '+12%',
//       changeType: 'positive'
//     },
//     {
//       name: 'Pending Approvals',
//       value: dashboardData?.users?.pending || 0,
//       icon: Clock,
//       color: 'yellow',
//       change: '+3',
//       changeType: 'neutral'
//     },
//     {
//       name: 'Total Properties',
//       value: dashboardData?.properties?.total || 0,
//       icon: Home,
//       color: 'green',
//       change: '+8%',
//       changeType: 'positive'
//     },
//     {
//       name: 'Monthly Revenue',
//       value: `₹${(dashboardData?.payments?.monthlyRevenue || 0).toLocaleString()}`,
//       icon: CreditCard,
//       color: 'purple',
//       change: '+15%',
//       changeType: 'positive'
//     }
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Admin Dashboard
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Manage your real estate platform
//           </p>
//         </motion.div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={stat.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
//                   <p className={`text-sm ${
//                     stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
//                     stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
//                     'text-gray-600 dark:text-gray-400'
//                   }`}>
//                     {stat.change} from last month
//                   </p>
//                 </div>
//                 <div className={`p-3 rounded-full ${
//                   stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
//                   stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900' :
//                   stat.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
//                   'bg-purple-100 dark:bg-purple-900'
//                 }`}>
//                   <stat.icon className={`w-6 h-6 ${
//                     stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
//                     stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
//                     stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
//                     'text-purple-600 dark:text-purple-400'
//                   }`} />
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
//             >
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Quick Actions
//               </h3>
//               <div className="space-y-2">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
//                       activeTab === tab.id
//                         ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
//                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                     }`}
//                   >
//                     <tab.icon className="w-5 h-5" />
//                     <span>{tab.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {activeTab === 'overview' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="space-y-6"
//               >
//                 {/* Recent Activity */}
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                     Recent Activity
//                   </h3>
//                   <div className="space-y-4">
//                     {dashboardData?.recentContacts?.map((contact: any, index: number) => (
//                       <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                         <div className="flex-1">
//                           <div className="text-sm font-medium text-gray-900 dark:text-white">
//                             New contact message
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             From {contact.name} - {contact.subject}
//                           </div>
//                         </div>
//                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                           {new Date(contact.createdAt).toLocaleDateString()}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Pending Approvals */}
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                     Pending Approvals
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
//                       <div className="flex items-center space-x-3">
//                         <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
//                         <div>
//                           <div className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
//                             {dashboardData?.users?.pending || 0}
//                           </div>
//                           <div className="text-sm text-yellow-600 dark:text-yellow-400">
//                             User Registrations
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//                       <div className="flex items-center space-x-3">
//                         <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
//                         <div>
//                           <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
//                             {dashboardData?.properties?.pending || 0}
//                           </div>
//                           <div className="text-sm text-blue-600 dark:text-blue-400">
//                             Property Listings
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {activeTab === 'users' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                   User Management
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   User management functionality will be implemented here.
//                 </p>
//               </motion.div>
//             )}

//             {activeTab === 'properties' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                   Property Management
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Property management functionality will be implemented here.
//                 </p>
//               </motion.div>
//             )}

//             {activeTab === 'payments' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                   Payment Management
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Payment management functionality will be implemented here.
//                 </p>
//               </motion.div>
//             )}

//             {activeTab === 'contacts' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
//               >
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                   Contact Messages
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Contact message management functionality will be implemented here.
//                 </p>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;













import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Home, 
  CreditCard, 
  MessageSquare, 
  BarChart3,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Define the User type to match our data structure
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  isApproved: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // --- Data Fetching ---
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    },
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.data.users as User[];
    },
    enabled: activeTab === 'users', // Only fetch users when the tab is active
  });
  
  // --- Mutations ---
  const approveUserMutation = useMutation({
    mutationFn: ({ userId, isApproved }: { userId: string; isApproved: boolean }) => {
      return api.put(`/admin/users/${userId}/approve`, { isApproved });
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] }); // Refresh the user list
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }); // Refresh dashboard stats
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status.");
    }
  });


  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Manage Users', icon: Users },
    { id: 'properties', name: 'Manage Properties', icon: Home },
    { id: 'payments', name: 'View Payments', icon: CreditCard },
    { id: 'messages', name: 'View Messages', icon: MessageSquare },
  ];
  
  const handleApprove = (userId: string) => {
    approveUserMutation.mutate({ userId, isApproved: true });
  };
  
  const handleReject = (userId: string) => {
    // Note: The backend treats rejection as setting isApproved to false
    approveUserMutation.mutate({ userId, isApproved: false });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={dashboardData} />;
      case 'users':
        return <UsersTab users={usersData} isLoading={isLoadingUsers} onApprove={handleApprove} onReject={handleReject} />;
      default:
        return <PlaceholderTab title={tabs.find(t => t.id === activeTab)?.name} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {isLoadingDashboard ? <LoadingSpinner /> : renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Child Components for Tabs ---

const OverviewTab = ({ data }: { data: any }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <StatCard title="Total Users" value={data?.userStats?.find((s:any) => s._id === 'buyer')?.count + data?.userStats?.find((s:any) => s._id === 'seller')?.count || 0} icon={Users} />
      <StatCard title="Pending Approvals" value={data?.userStats?.reduce((acc: number, curr: any) => acc + curr.pending, 0) || 0} icon={Clock} />
      <StatCard title="Properties Listed" value={data?.propertyStats?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0} icon={Home} />
      <StatCard title="Total Revenue" value={`₹${data?.paymentStats?.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0) || 0}`} icon={CreditCard} />
    </div>
  </motion.div>
);

const UsersTab = ({ users, isLoading, onApprove, onReject }: { users: User[] | undefined, isLoading: boolean, onApprove: (id: string) => void, onReject: (id: string) => void }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Management</h3>
    {isLoading ? <LoadingSpinner /> : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users?.map(user => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isApproved ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {!user.isApproved && user.role !== 'admin' && (
                    <>
                      <button onClick={() => onApprove(user._id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"><CheckCircle className="w-5 h-5" /></button>
                      <button onClick={() => onReject(user._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><XCircle className="w-5 h-5" /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </motion.div>
);

const PlaceholderTab = ({ title }: { title: string | undefined }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title || 'Management'}</h3>
    <p className="text-gray-600 dark:text-gray-400">
      The functionality for managing {title?.toLowerCase()} will be implemented here.
    </p>
  </motion.div>
);

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
          <dd className="text-lg font-semibold text-gray-900 dark:text-white">{value}</dd>
        </dl>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
);

export default AdminDashboard;
