import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, AlertCircle, Check, ChevronDown, Flag } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface Attachment {
  name: string;
  size: number;
  type: string;
}

interface FormData {
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target: 'all' | 'selected';
  selectedBranches: string[];
  attachments: Attachment[];
  scheduleDate?: string;
}

const AnnouncementForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    message: '',
    priority: 'normal',
    target: 'all',
    selectedBranches: [],
    attachments: []
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, message: editor.getHTML() }));
    }
  });

  // Sample data for branches
  const branches = [
    { id: '1', name: 'Ambur Central' },
    { id: '2', name: 'Vaniyambadi North' },
    { id: '3', name: 'Chennai East' },
    { id: '4', name: 'Pernambut Tech Park' }
  ];

  // Priority levels configuration
  const priorityLevels = [
    {
      value: 'low',
      label: 'Low Priority',
      description: 'General information, non-urgent updates',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: 'text-gray-500',
      badge: 'bg-gray-500'
    },
    {
      value: 'normal',
      label: 'Normal Priority',
      description: 'Standard announcements and updates',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: 'text-blue-500',
      badge: 'bg-blue-500'
    },
    {
      value: 'high',
      label: 'High Priority',
      description: 'Important updates requiring attention',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: 'text-orange-500',
      badge: 'bg-orange-500'
    },
    {
      value: 'urgent',
      label: 'Urgent',
      description: 'Critical announcements requiring immediate action',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: 'text-red-500',
      badge: 'bg-red-500'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleBranchSelection = (branchId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedBranches.includes(branchId);
      return {
        ...prev,
        selectedBranches: isSelected
          ? prev.selectedBranches.filter(id => id !== branchId)
          : [...prev.selectedBranches, branchId]
      };
    });
  };

  const handleSelectAllBranches = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      target: e.target.checked ? 'all' : 'selected',
      selectedBranches: e.target.checked ? [] : prev.selectedBranches
    }));
  };

  const getSelectedBranchesText = () => {
    if (formData.target === 'all') return 'All Branches';
    if (formData.selectedBranches.length === 0) return 'Select Branches';
    if (formData.selectedBranches.length === 1) {
      return branches.find(b => b.id === formData.selectedBranches[0])?.name;
    }
    return `${formData.selectedBranches.length} branches selected`;
  };

  const getCurrentPriority = () => {
    return priorityLevels.find(p => p.value === formData.priority) || priorityLevels[1];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!formData.message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (formData.target === 'selected' && formData.selectedBranches.length === 0) {
      alert('Please select at least one branch');
      return;
    }

    console.log('Form submitted:', {
      ...formData,
      selectedBranches: formData.target === 'all' ? branches.map(b => b.id) : formData.selectedBranches
    });
    navigate('/dashboard/announcements');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/announcements')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Announcements
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter announcement title"
              required
            />
          </div>

          {/* Priority Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {priorityLevels.map((priority) => (
                <label
                  key={priority.value}
                  className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    formData.priority === priority.value
                      ? `${priority.color} border-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="sr-only"
                  />
                  <div className="flex items-start w-full">
                    <div className="flex-shrink-0 mr-3">
                      <Flag className={`w-5 h-5 ${priority.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium">{priority.label}</span>
                        {formData.priority === priority.value && (
                          <div className={`ml-2 w-2 h-2 rounded-full ${priority.badge}`}></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {priority.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            {/* Priority Preview */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Flag className={`w-4 h-4 mr-2 ${getCurrentPriority().icon}`} />
                <span className="text-sm font-medium text-gray-700">
                  Selected Priority: 
                </span>
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getCurrentPriority().color}`}>
                  {getCurrentPriority().label}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 ml-6">
                {getCurrentPriority().description}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <div className="prose max-w-none">
              <EditorContent editor={editor} className="min-h-[200px] border border-gray-300 rounded-lg p-4" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Branches
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span className="text-gray-900">{getSelectedBranchesText()}</span>
                <ChevronDown size={20} className="text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2">
                    <label className="flex items-center px-3 py-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={formData.target === 'all'}
                        onChange={handleSelectAllBranches}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-900">All Branches</span>
                    </label>
                    <div className="border-t my-2"></div>
                    {branches.map(branch => (
                      <label
                        key={branch.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedBranches.includes(branch.id)}
                          onChange={() => handleBranchSelection(branch.id)}
                          disabled={formData.target === 'all'}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-900">{branch.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, XLS, XLSX up to 10MB
                </p>
              </div>
            </div>

            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.scheduleDate}
              onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to send immediately
            </p>
          </div>

          {/* Priority-based Warning */}
          <div className={`flex items-center p-4 rounded-lg ${
            formData.priority === 'urgent' 
              ? 'bg-red-50 border border-red-200'
              : formData.priority === 'high'
              ? 'bg-orange-50 border border-orange-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <AlertCircle className={`mr-2 ${
              formData.priority === 'urgent' 
                ? 'text-red-500'
                : formData.priority === 'high'
                ? 'text-orange-500'
                : 'text-blue-500'
            }`} size={20} />
            <div>
              <p className={`text-sm font-medium ${
                formData.priority === 'urgent' 
                  ? 'text-red-800'
                  : formData.priority === 'high'
                  ? 'text-orange-800'
                  : 'text-blue-800'
              }`}>
                {formData.priority === 'urgent' && 'Urgent Announcement'}
                {formData.priority === 'high' && 'High Priority Announcement'}
                {formData.priority === 'normal' && 'Standard Announcement'}
                {formData.priority === 'low' && 'Low Priority Announcement'}
              </p>
              <p className={`text-sm ${
                formData.priority === 'urgent' 
                  ? 'text-red-700'
                  : formData.priority === 'high'
                  ? 'text-orange-700'
                  : 'text-blue-700'
              }`}>
                {formData.priority === 'urgent' && 'This announcement will be marked as urgent and will appear prominently to all recipients.'}
                {formData.priority === 'high' && 'This announcement will be highlighted as important and require attention.'}
                {formData.priority === 'normal' && 'This announcement will be sent with standard priority.'}
                {formData.priority === 'low' && 'This announcement will be sent as general information.'}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/announcements')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save size={20} className="mr-2" />
              {formData.scheduleDate ? 'Schedule' : 'Send'} Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;