import { redirect } from 'next/navigation';

export default function OwnerDashboardIndex() {
  // We utilize the dynamic pipeline pages as the true views.
  // The global landing immediately redirects to the first primary tab.
  redirect('/dashboard/owner/marketing');
}
