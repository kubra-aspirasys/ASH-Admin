import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit2, Trash2, Filter, BookOpen, Video, Users, Trophy } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  enrolledStudents: number;
  totalVideos: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, subtitle }) => {
  return (
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
};

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  // Sample data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Full Stack Development',
      status: 'published',
      enrolledStudents: 156,
      totalVideos: 48
    },
    {
      id: '2',
      title: 'Data Science Fundamentals',
      status: 'published',
      enrolledStudents: 89,
      totalVideos: 32
    },
    {
      id: '3',
      title: 'Cloud Computing Essentials',
      status: 'draft',
      enrolledStudents: 0,
      totalVideos: 40
    },
    {
      id: '4',
      title: 'Mobile App Development',
      status: 'archived',
      enrolledStudents: 45,
      totalVideos: 36
    }
  ];

  // Calculate metrics
  const metrics = {
    totalPublishedCourses: courses.filter(c => c.status === 'published').length,
    totalEnrolled: courses.reduce((sum, c) => sum + c.enrolledStudents, 0),
    mostPopularCourse: courses.reduce((prev, curr) => 
      prev.enrolledStudents > curr.enrolledStudents ? prev : curr
    ).title
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Course['status']) => {
    const badges = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleDelete = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      // Delete course logic here
      console.log('Deleting course:', courseId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
        <button
          onClick={() => navigate('/dashboard/courses/new')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create New Course
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total Published Courses"
          value={metrics.totalPublishedCourses}
          icon={<BookOpen size={24} className="text-white" />}
          color="bg-indigo-600"
        />
        <MetricCard
          title="Total Enrolled Aspirants"
          value={metrics.totalEnrolled}
          icon={<Users size={24} className="text-white" />}
          color="bg-emerald-600"
        />
        <MetricCard
          title="Most Popular Course"
          value={metrics.mostPopularCourse}
          icon={<Trophy size={24} className="text-white" />}
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="relative">
          <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published' | 'archived')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Aspirants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Videos</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <BookOpen size={20} className="text-indigo-600 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-500">
                      <Users size={16} className="mr-2" />
                      <span>{course.enrolledStudents}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-500">
                      <Video size={16} className="mr-2" />
                      <span>{course.totalVideos}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/courses/${course.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit Course"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Course"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseList;