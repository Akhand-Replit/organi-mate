
import React from "react";
import { Check, UserRound, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePendingCompanyApplicationsCount } from "../hooks/usePendingApprovals";
import { usePendingSubscriptionRequestsCount } from "../hooks/usePendingSubscriptionRequests";
import { useSupportMessagesCount } from "../hooks/useSupportMessagesCount";

export const PendingApprovalsCard: React.FC = () => {
  const navigate = useNavigate();
  const { data: pendingCompany, isLoading: loadingCompany } = usePendingCompanyApplicationsCount();
  const { data: pendingSubs } = usePendingSubscriptionRequestsCount();
  const { data: unreadMessages, isLoading: loadingMessages } = useSupportMessagesCount();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Pending Approvals</h2>
      <p className="text-muted-foreground mb-5">Items requiring your attention</p>
      <div className="space-y-4">
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => navigate("/admin/company-applications")}
          role="button"
          tabIndex={0}
        >
          <Check className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <p className="font-medium">Company Registration</p>
            <p className="text-sm text-muted-foreground">
              {loadingCompany ? "Loading..." : `${pendingCompany ?? 0} pending registrations`}
            </p>
          </div>
        </div>
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => navigate("/admin/reports")}
          role="button"
          tabIndex={0}
        >
          <UserRound className="h-5 w-5 text-purple-500 mr-3" />
          <div>
            <p className="font-medium">Subscription Upgrades</p>
            <p className="text-sm text-muted-foreground">
              {pendingSubs} pending requests
            </p>
          </div>
        </div>
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => navigate("/admin/messages")}
          role="button"
          tabIndex={0}
        >
          <Bell className="h-5 w-5 text-amber-500 mr-3" />
          <div>
            <p className="font-medium">Support Messages</p>
            <p className="text-sm text-muted-foreground">
              {loadingMessages ? "Loading..." : `${unreadMessages ?? 0} unread messages`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
