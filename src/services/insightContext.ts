import { User } from '@/types/user';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';
import { Deal } from '@/types/deal';
import { Task } from '@/types/task';

export function generateInsightContext(
  user: User,
  contacts: Contact[],
  companies: Company[],
  deals: Deal[],
  tasks: Task[]
): string {
  const totalContacts = contacts.length;
  const totalCompanies = companies.length;
  const totalDeals = deals.length;
  const totalDealValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const openTasks = tasks.filter(task => task.status === 'Open').length;
  const dueTodayTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  }).length;

  const recentDeals = deals
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const industryDistribution = companies.reduce((acc, company) => {
    if (company.industry) {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topIndustries = Object.entries(industryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([industry]) => industry);

  return `
    User: ${user.name || 'Unknown'} (${user.role || 'Unknown'})
    Total Contacts: ${totalContacts}
    Total Companies: ${totalCompanies}
    Total Deals: ${totalDeals}
    Total Deal Value: $${totalDealValue.toLocaleString()}
    Open Tasks: ${openTasks} (${dueTodayTasks} due today)
    Recent Deals: ${recentDeals.map(deal => `${deal.name || 'Unnamed Deal'} (${deal.stage || 'Unknown Stage'})`).join(', ')}
    Industry Distribution: ${Object.entries(industryDistribution).map(([industry, count]) => `${industry}: ${count}`).join(', ')}
    Top Industries: ${topIndustries.join(', ')}
    User's Recent Performance: [This would be filled with actual performance data]
    Recent Activity: [This would be filled with recent interactions, changes, etc.]
    
    Please provide insights on the CRM data above, and also research and provide recent news or trends for the top industries listed. Suggest ways to use this information for outreach.
  `;
}