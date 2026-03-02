import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shield, CreditCard, Building2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccountSettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Account Settings | PropGrowthX</title>
        <meta name="description" content="Manage your account security, billing, and property preferences." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-5 h-5 text-red-600" />
                <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
              </div>
              <p className="text-sm text-gray-600">Manage your account security and billing</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="justify-start h-auto py-5 px-5 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                <Link to="/security-settings">
                  <Shield className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 text-sm">Security Settings</div>
                    <div className="text-xs text-gray-600">Password, 2FA, sessions</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start h-auto py-5 px-5 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                <Link to="/billing">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 text-sm">Billing & Payments</div>
                    <div className="text-xs text-gray-600">Payment methods, invoices</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start h-auto py-5 px-5 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm md:col-span-2">
                <Link to="/property-settings">
                  <Building2 className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 text-sm">Property Settings</div>
                    <div className="text-xs text-gray-600">Default listing preferences</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettingsPage;