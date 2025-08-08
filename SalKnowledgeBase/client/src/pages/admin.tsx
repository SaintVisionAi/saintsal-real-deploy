import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, Calendar, CheckCircle, XCircle, Crown } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch all users (admin only)
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    },
  });

  // Fetch new contacts (unverified users)
  const { data: contacts, isLoading: contactsLoading, error: contactsError } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (isLoading || usersLoading || contactsLoading) {
    return (
      <div className="h-screen bg-[#0f0f0f] text-white">
        <Header />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
            <p className="text-gray-300">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Check for admin access error
  if (usersError || contactsError) {
    const error = usersError || contactsError;
    if (error && (error.message.includes('403') || error.message.includes('Admin access required'))) {
      return (
        <div className="h-screen bg-[#0f0f0f] text-white">
          <Header />
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto p-8">
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-300 mb-6">
                You need administrator privileges to access this dashboard. 
                Please contact your system administrator.
              </p>
              <a 
                href="/" 
                className="inline-block bg-[#d4af37] text-black px-6 py-2 rounded-lg hover:bg-[#b8941f] transition-colors"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="h-8 w-8 text-[#d4af37]" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {(user as any)?.isAdmin && (
            <Badge className="bg-[#d4af37] text-black">Administrator</Badge>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-[#d4af37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users?.length || 0}</div>
              <p className="text-xs text-gray-400">
                {users?.filter(u => u.emailVerified).length || 0} verified
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">New Contacts</CardTitle>
              <Mail className="h-4 w-4 text-[#d4af37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{contacts?.length || 0}</div>
              <p className="text-xs text-gray-400">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Admins</CardTitle>
              <Crown className="h-4 w-4 text-[#d4af37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users?.filter(u => u.isAdmin).length || 0}
              </div>
              <p className="text-xs text-gray-400">
                System administrators
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Contacts */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#d4af37]" />
                New Contacts (Unverified)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {contacts?.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No new contacts</p>
                ) : (
                  contacts?.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-white">{contact.name}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Pending
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* All Users */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#d4af37]" />
                All Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users?.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No users found</p>
                ) : (
                  users?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-white">{user.name}</div>
                          {user.isAdmin && (
                            <Crown className="h-4 w-4 text-[#d4af37]" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.emailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge 
                          variant={user.emailVerified ? "default" : "destructive"}
                          className={user.emailVerified ? "bg-green-600" : ""}
                        >
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}