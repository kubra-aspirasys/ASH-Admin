import React, { useState } from 'react';
import { Users, Building2, Award, Briefcase, Zap, CreditCard, Download, FileSpreadsheet, File as FilePdf, ChevronDown, ChevronUp, Calendar, Filter } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center mb-2">
      <div className={`${color} p-3 rounded-lg mr-3`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

interface ReportSection {
  id: string;
  title: string;
  description: string;
  data: any[];
  columns: {
    key: string;
    header: string;
    render?: (value: any) => React.ReactNode;
  }[];
}

const ReportsDashboard: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    branch: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Sample data for metrics
  const metrics = {
    totalAspirants: 1250,
    jobReadyAspirants: 340,
    activeBranches: 24,
    certificatesIssued: 285,
    totalXP: 2950280,
    streakRestoration: 45600
  };

  // Sample data for reports
  const reportSections: ReportSection[] = [
    {
      id: 'aspirant-progress',
      title: 'Aspirant Progress Report',
      description: 'Track individual aspirant progress across courses and activities',
      data: [
        {
          name: 'Mohammed Imran',
          email: 'imran@example.com',
          branch: 'Ambur Central',
          course: 'Full Stack Development',
          completion: 85,
          xp: 28450,
          streak: 'Active (15 days)',
          interview: 8.5,
          certificate: 'Approved'
        }
      ],
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'branch', header: 'Branch' },
        { key: 'completion', header: 'Completion %' },
        { key: 'xp', header: 'XP Earned' },
        { key: 'streak', header: 'Streak Status' },
        { key: 'certificate', header: 'Certificate' }
      ]
    },
    {
      id: 'xp-streak',
      title: 'XP & Streak Report',
      description: 'Analyze XP earnings and streak maintenance patterns',
      data: [
        {
          name: 'Fatima Zahra',
          dailyGoals: '28/30 days',
          xpEarned: 27820,
          streakDays: 30,
          lastActive: '2024-03-10'
        }
      ],
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'dailyGoals', header: 'Daily Goals' },
        { key: 'xpEarned', header: 'XP Earned' },
        { key: 'streakDays', header: 'Streak Days' }
      ]
    },
    {
      id: 'interview-results',
      title: 'Interview Result Report',
      description: 'View interview performance and feedback across all aspirants',
      data: [
        {
          aspirant: 'Abdul Rahman',
          week: 'Week 1',
          score: 8,
          feedback: 'Excellent communication skills',
          interviewer: 'John Doe',
          mode: 'Online'
        }
      ],
      columns: [
        { key: 'aspirant', header: 'Aspirant' },
        { key: 'week', header: 'Week' },
        { key: 'score', header: 'Score' },
        { key: 'interviewer', header: 'Interviewer' },
        { key: 'mode', header: 'Mode' }
      ]
    },
    {
      id: 'payments',
      title: 'Payment Summary Report',
      description: 'Track streak restoration payments and other financial transactions',
      data: [
        {
          aspirant: 'Omar Farooq',
          amount: 50,
          daysRestored: 2,
          date: '2024-03-10',
          mode: 'UPI',
          branch: 'Chennai East'
        }
      ],
      columns: [
        { key: 'aspirant', header: 'Aspirant' },
        { key: 'amount', header: 'Amount' },
        { key: 'daysRestored', header: 'Days Restored' },
        { key: 'date', header: 'Date' },
        { key: 'mode', header: 'Payment Mode' }
      ]
    },
    {
      id: 'certificates',
      title: 'Certificate Report',
      description: 'Track certificate issuance and approval status',
      data: [
        {
          aspirant: 'Ayesha Siddiqui',
          course: 'Full Stack Development',
          capstoneDate: '2024-03-05',
          certificateDate: '2024-03-10',
          certificateId: 'CERT-2024-001'
        }
      ],
      columns: [
        { key: 'aspirant', header: 'Aspirant' },
        { key: 'course', header: 'Course' },
        { key: 'capstoneDate', header: 'Capstone Date' },
        { key: 'certificateDate', header: 'Certificate Date' },
        { key: 'certificateId', header: 'Certificate ID' }
      ]
    }
  ];

  const handleExport = (sectionId: string, format: 'csv' | 'pdf') => {
    const section = reportSections.find(s => s.id === sectionId);
    if (!section) return;

    if (format === 'csv') {
      const headers = section.columns.map(col => col.header).join(',');
      const rows = section.data.map(row => 
        section.columns.map(col => row[col.key]).join(',')
      ).join('\n');
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${section.id}-report.csv`;
      a.click();
    } else {
      // PDF export logic would go here using jsPDF
      console.log('Exporting PDF:', section.id);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Sample data for XP trend chart
  const xpTrendData = [
    { month: 'Jan', xp: 45000 },
    { month: 'Feb', xp: 52000 },
    { month: 'Mar', xp: 49000 },
    { month: 'Apr', xp: 63000 },
    { month: 'May', xp: 58000 },
    { month: 'Jun', xp: 72000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Branches</option>
              <option value="ambur">Ambur Central</option>
              <option value="chennai">Chennai East</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total Aspirants"
          value={metrics.totalAspirants}
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-600"
        />
        <MetricCard
          title="Job-Ready Aspirants"
          value={metrics.jobReadyAspirants}
          icon={<Briefcase size={24} className="text-white" />}
          color="bg-green-600"
          subtitle={`${((metrics.jobReadyAspirants / metrics.totalAspirants) * 100).toFixed(1)}% of total`}
        />
        <MetricCard
          title="Active Branches"
          value={metrics.activeBranches}
          icon={<Building2 size={24} className="text-white" />}
          color="bg-purple-600"
        />
        <MetricCard
          title="Certificates Issued"
          value={metrics.certificatesIssued}
          icon={<Award size={24} className="text-white" />}
          color="bg-amber-600"
        />
        <MetricCard
          title="Total XP Earned"
          value={metrics.totalXP.toLocaleString()}
          icon={<Zap size={24} className="text-white" />}
          color="bg-indigo-600"
        />
        <MetricCard
          title="Streak Restorations"
          value={`₹${metrics.streakRestoration.toLocaleString()}`}
          icon={<CreditCard size={24} className="text-white" />}
          color="bg-rose-600"
        />
      </div>

      {/* XP Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">XP Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={xpTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="xp" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Sections */}
      <div className="space-y-4">
        {reportSections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection(section.id)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="text-gray-500" />
              ) : (
                <ChevronDown className="text-gray-500" />
              )}
            </div>

            {expandedSection === section.id && (
              <div className="p-4 border-t border-gray-200">
                <div className="mb-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleExport(section.id, 'csv')}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <FileSpreadsheet size={18} className="mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport(section.id, 'pdf')}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <FilePdf size={18} className="mr-2" />
                    Export PDF
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {section.columns.map((column) => (
                          <th
                            key={column.key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {section.data.map((row, index) => (
                        <tr key={index}>
                          {section.columns.map((column) => (
                            <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {column.render ? column.render(row[column.key]) : row[column.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsDashboard;