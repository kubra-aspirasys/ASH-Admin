import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Youtube, FileCheck, FolderGit2, Trash2, Plus, Edit2, Eye, EyeOff, Check, X, Clock, AlertTriangle } from 'lucide-react';
import YouTube from 'react-youtube';

interface Video {
  id: string;
  title: string;
  url: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswers: number[]; // Changed to array for multiple selection
}

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  document?: File;
}

interface Stage {
  id: string;
  name: string;
  duration: number; // Duration in working hours
  videos: Video[];
  assessments: {
    quiz?: Quiz;
    assignment?: Assignment;
    capstone?: Assignment;
  };
}

interface CourseData {
  title: string;
  stages: Stage[];
}

const CourseWizard: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    stages: []
  });

  const [currentStage, setCurrentStage] = useState<Stage>({
    id: '1',
    name: '',
    duration: 40, // Default 40 working hours
    videos: [],
    assessments: {}
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Modal states for in-app notifications
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Working hours configuration (8 hours per working day)
  const WORKING_HOURS_PER_DAY = 8;

  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const showValidationError = (message: string) => {
    setValidationMessage(message);
    setShowValidationModal(true);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const addVideo = () => {
    if (!newVideo.title.trim()) {
      showValidationError('Please enter a video title');
      return;
    }
    
    if (!newVideo.url.trim()) {
      showValidationError('Please enter a YouTube URL');
      return;
    }

    const videoId = getYouTubeVideoId(newVideo.url);
    if (!videoId) {
      showValidationError('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)');
      return;
    }

    const video: Video = {
      id: Math.random().toString(36).substr(2, 9),
      title: newVideo.title.trim(),
      url: newVideo.url.trim()
    };
    
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? { ...stage, videos: [...stage.videos, video] }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        videos: [...prev.videos, video]
      }));
    }
    
    setNewVideo({ title: '', url: '' });
    showSuccess('Video added successfully!');
  };

  const removeVideo = (videoId: string) => {
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? { ...stage, videos: stage.videos.filter(v => v.id !== videoId) }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v.id !== videoId)
      }));
    }
  };

  const addQuiz = () => {
    const quiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      questions: [{
        id: Math.random().toString(36).substr(2, 9),
        question: '',
        options: ['', '', '', ''],
        correctAnswers: [0] // Default to first option
      }]
    };
    
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? { ...stage, assessments: { ...stage.assessments, quiz } }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: { ...prev.assessments, quiz }
      }));
    }
  };

  const addAssignment = () => {
    const assignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: ''
    };
    
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? { ...stage, assessments: { ...stage.assessments, assignment } }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: { ...prev.assessments, assignment }
      }));
    }
  };

  const addCapstone = () => {
    const capstone: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: ''
    };
    
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? { ...stage, assessments: { ...stage.assessments, capstone } }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: { ...prev.assessments, capstone }
      }));
    }
  };

  const addQuizQuestion = () => {
    const targetStage = editingStageId 
      ? courseData.stages.find(s => s.id === editingStageId)
      : currentStage;
      
    if (!targetStage?.assessments.quiz) return;
    
    const newQuestion: QuizQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      question: '',
      options: ['', '', '', ''],
      correctAnswers: [0]
    };
    
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? {
                ...stage,
                assessments: {
                  ...stage.assessments,
                  quiz: {
                    ...stage.assessments.quiz!,
                    questions: [...stage.assessments.quiz!.questions, newQuestion]
                  }
                }
              }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: {
          ...prev.assessments,
          quiz: {
            ...prev.assessments.quiz!,
            questions: [...prev.assessments.quiz!.questions, newQuestion]
          }
        }
      }));
    }
  };

  const updateQuizQuestion = (questionId: string, field: string, value: any) => {
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? {
                ...stage,
                assessments: {
                  ...stage.assessments,
                  quiz: {
                    ...stage.assessments.quiz!,
                    questions: stage.assessments.quiz!.questions.map(q => 
                      q.id === questionId ? { ...q, [field]: value } : q
                    )
                  }
                }
              }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: {
          ...prev.assessments,
          quiz: {
            ...prev.assessments.quiz!,
            questions: prev.assessments.quiz!.questions.map(q => 
              q.id === questionId ? { ...q, [field]: value } : q
            )
          }
        }
      }));
    }
  };

  const toggleCorrectAnswer = (questionId: string, optionIndex: number) => {
    const targetStage = editingStageId 
      ? courseData.stages.find(s => s.id === editingStageId)
      : currentStage;
      
    const question = targetStage?.assessments.quiz?.questions.find(q => q.id === questionId);
    if (!question) return;

    const newCorrectAnswers = question.correctAnswers.includes(optionIndex)
      ? question.correctAnswers.filter(i => i !== optionIndex)
      : [...question.correctAnswers, optionIndex];

    // Ensure at least one correct answer
    if (newCorrectAnswers.length === 0) return;

    updateQuizQuestion(questionId, 'correctAnswers', newCorrectAnswers);
  };

  const removeQuizQuestion = (questionId: string) => {
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? {
                ...stage,
                assessments: {
                  ...stage.assessments,
                  quiz: {
                    ...stage.assessments.quiz!,
                    questions: stage.assessments.quiz!.questions.filter(q => q.id !== questionId)
                  }
                }
              }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: {
          ...prev.assessments,
          quiz: {
            ...prev.assessments.quiz!,
            questions: prev.assessments.quiz!.questions.filter(q => q.id !== questionId)
          }
        }
      }));
    }
  };

  const updateStageField = (field: string, value: any) => {
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? { ...stage, [field]: value }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateAssessmentField = (assessmentType: 'quiz' | 'assignment' | 'capstone', field: string, value: any) => {
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? {
                ...stage,
                assessments: {
                  ...stage.assessments,
                  [assessmentType]: {
                    ...stage.assessments[assessmentType],
                    [field]: value
                  }
                }
              }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: {
          ...prev.assessments,
          [assessmentType]: {
            ...prev.assessments[assessmentType],
            [field]: value
          }
        }
      }));
    }
  };

  const handleDocumentUpload = (assessmentType: 'assignment' | 'capstone', file: File) => {
    updateAssessmentField(assessmentType, 'document', file);
  };

  const removeAssessment = (assessmentType: 'quiz' | 'assignment' | 'capstone') => {
    if (editingStageId) {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(stage => 
          stage.id === editingStageId 
            ? {
                ...stage,
                assessments: {
                  ...stage.assessments,
                  [assessmentType]: undefined
                }
              }
            : stage
        )
      }));
    } else {
      setCurrentStage(prev => ({
        ...prev,
        assessments: {
          ...prev.assessments,
          [assessmentType]: undefined
        }
      }));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!courseData.title.trim()) {
        showValidationError('Please enter a course title');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!currentStage.name.trim()) {
        showValidationError('Please enter a stage name');
        return;
      }
      if (currentStage.videos.length === 0) {
        showValidationError('Please add at least one video to this stage');
        return;
      }
      
      setShowCompletionModal(true);
    }
  };

  const addCurrentStageAndContinue = () => {
    const stageToSave = { ...currentStage };
    setCourseData(prev => ({
      ...prev,
      stages: [...prev.stages, stageToSave]
    }));
    
    const nextStageNumber = courseData.stages.length + 2;
    setCurrentStage({
      id: nextStageNumber.toString(),
      name: '',
      duration: 40, // Default 40 working hours
      videos: [],
      assessments: {}
    });
    
    setShowCompletionModal(false);
    setCurrentStep(2);
  };

  const addCurrentStageAndPreview = () => {
    const stageToSave = { ...currentStage };
    setCourseData(prev => ({
      ...prev,
      stages: [...prev.stages, stageToSave]
    }));
    
    setShowCompletionModal(false);
    setCurrentStep(3);
  };

  const handleEditStage = (stageId: string) => {
    setEditingStageId(stageId);
    setCurrentStep(2);
  };

  const handleSaveStageEdit = () => {
    setEditingStageId(null);
    setCurrentStep(3);
  };

  const handleCancelStageEdit = () => {
    setEditingStageId(null);
    setCurrentStep(3);
  };

  const handleDeleteStage = (stageId: string) => {
    setCourseData(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== stageId)
    }));
    showSuccess('Stage deleted successfully');
  };

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const confirmPublish = async () => {
    setIsPublishing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Publishing course:', courseData);
      
      setShowPublishModal(false);
      setIsPublishing(false);
      showSuccess('Course published successfully!');
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard/courses');
      }, 2000);
      
    } catch (error) {
      setIsPublishing(false);
      showValidationError('Failed to publish course. Please try again.');
    }
  };

  const getCurrentStageData = () => {
    if (editingStageId) {
      return courseData.stages.find(s => s.id === editingStageId) || currentStage;
    }
    return currentStage;
  };

  // Calculate total working hours and working days
  const getTotalDuration = () => {
    const totalHours = courseData.stages.reduce((sum, stage) => sum + stage.duration, 0);
    const workingDays = Math.ceil(totalHours / WORKING_HOURS_PER_DAY);
    
    return {
      totalHours,
      workingDays,
      formattedDuration: `${totalHours} working hours (${workingDays} working day${workingDays !== 1 ? 's' : ''})`
    };
  };

  // Format individual stage duration
  const formatStageDuration = (hours: number) => {
    const days = Math.ceil(hours / WORKING_HOURS_PER_DAY);
    return {
      hours,
      days,
      formatted: `${hours} working hours (${days} working day${days !== 1 ? 's' : ''})`
    };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Course</h2>
              <p className="text-gray-600">Let's start by giving your course a name</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                placeholder="Enter course title"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        const stageData = getCurrentStageData();
        const stageIndex = editingStageId 
          ? courseData.stages.findIndex(s => s.id === editingStageId) + 1
          : courseData.stages.length + 1;

        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {editingStageId ? 'Edit' : ''} Stage {stageIndex}: {stageData.name || 'Untitled Stage'}
              </h2>
              <p className="text-gray-600">
                {editingStageId ? 'Edit videos and assessments for this stage' : 'Add videos and assessments for this stage'}
              </p>
              {editingStageId && (
                <div className="mt-2 flex justify-center space-x-3">
                  <button
                    onClick={handleSaveStageEdit}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check size={18} className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelStageEdit}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X size={18} className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Stage Name and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage Name
                </label>
                <input
                  type="text"
                  value={stageData.name}
                  onChange={(e) => updateStageField('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Beginner, Intermediate, Advanced"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Duration (Working Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={stageData.duration}
                  onChange={(e) => updateStageField('duration', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="40"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Estimated working hours to complete this stage
                  <br />
                  <span className="font-medium text-indigo-600">
                    {formatStageDuration(stageData.duration).formatted}
                  </span>
                </p>
              </div>
            </div>

            {/* Videos Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Videos</h3>
              
              {/* Add Video Form */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Add New Video</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      placeholder="Enter video title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={newVideo.url}
                        onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={addVideo}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                      >
                        <Plus size={20} className="mr-2" />
                        Add Video
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Supported formats: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
                    </p>
                  </div>
                </div>
              </div>

              {/* Video List */}
              <div className="space-y-4">
                {stageData.videos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Youtube size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No videos added yet. Add your first video above.</p>
                  </div>
                ) : (
                  stageData.videos.map((video, index) => {
                    const videoId = getYouTubeVideoId(video.url);
                    return (
                      <div key={video.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{video.title}</h4>
                            <p className="text-sm text-gray-500">Video {index + 1}</p>
                          </div>
                          <button
                            onClick={() => removeVideo(video.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove video"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {videoId && (
                          <div className="aspect-video max-w-md">
                            <YouTube
                              videoId={videoId}
                              opts={{
                                width: '100%',
                                height: '100%'
                              }}
                              className="w-full h-full"
                            />
                          </div>
                        )}
                        {!videoId && (
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <p className="text-red-600 text-sm">Invalid YouTube URL</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Assessments Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Assessments</h3>
              
              {/* Assessment Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {!stageData.assessments.quiz && (
                  <button
                    onClick={addQuiz}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <FileCheck size={32} className="text-indigo-600 mb-2" />
                      <span className="font-medium text-gray-700">Add Quiz</span>
                      <span className="text-sm text-gray-500">Multiple choice questions</span>
                    </div>
                  </button>
                )}

                {!stageData.assessments.assignment && (
                  <button
                    onClick={addAssignment}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <Edit2 size={32} className="text-indigo-600 mb-2" />
                      <span className="font-medium text-gray-700">Add Assignment</span>
                      <span className="text-sm text-gray-500">Practical tasks</span>
                    </div>
                  </button>
                )}

                {!stageData.assessments.capstone && (
                  <button
                    onClick={addCapstone}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <FolderGit2 size={32} className="text-purple-600 mb-2" />
                      <span className="font-medium text-gray-700">Add Capstone Project</span>
                      <span className="text-sm text-gray-500">Final project</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Quiz Editor */}
              {stageData.assessments.quiz && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Quiz</h4>
                    <button
                      onClick={() => removeAssessment('quiz')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={stageData.assessments.quiz.title}
                      onChange={(e) => updateAssessmentField('quiz', 'title', e.target.value)}
                      placeholder="Quiz Title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />

                    {stageData.assessments.quiz.questions.map((question, qIndex) => (
                      <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-gray-600">Question {qIndex + 1}</span>
                          <button
                            onClick={() => removeQuizQuestion(question.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuizQuestion(question.id, 'question', e.target.value)}
                          placeholder="Enter question"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500"
                        />

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Options (check all correct answers):
                          </p>
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={question.correctAnswers.includes(oIndex)}
                                onChange={() => toggleCorrectAnswer(question.id, oIndex)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[oIndex] = e.target.value;
                                  updateQuizQuestion(question.id, 'options', newOptions);
                                }}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Correct answers: {question.correctAnswers.length > 0 
                            ? question.correctAnswers.map(i => `Option ${i + 1}`).join(', ')
                            : 'None selected'
                          }
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addQuizQuestion}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
                    >
                      <Plus size={20} className="inline mr-2" />
                      Add Question
                    </button>
                  </div>
                </div>
              )}

              {/* Assignment Editor */}
              {stageData.assessments.assignment && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Assignment</h4>
                    <button
                      onClick={() => removeAssessment('assignment')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={stageData.assessments.assignment.title}
                      onChange={(e) => updateAssessmentField('assignment', 'title', e.target.value)}
                      placeholder="Assignment Title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    
                    <textarea
                      value={stageData.assessments.assignment.description}
                      onChange={(e) => updateAssessmentField('assignment', 'description', e.target.value)}
                      placeholder="Assignment Description and Instructions"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Assignment Document (Optional)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload('assignment', file);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      {stageData.assessments.assignment.document && (
                        <p className="mt-1 text-sm text-green-600">
                          ✓ {stageData.assessments.assignment.document.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Capstone Editor */}
              {stageData.assessments.capstone && (
                <div className="bg-white border border-purple-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-purple-800">Capstone Project</h4>
                    <button
                      onClick={() => removeAssessment('capstone')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={stageData.assessments.capstone.title}
                      onChange={(e) => updateAssessmentField('capstone', 'title', e.target.value)}
                      placeholder="Capstone Project Title"
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    
                    <textarea
                      value={stageData.assessments.capstone.description}
                      onChange={(e) => updateAssessmentField('capstone', 'description', e.target.value)}
                      placeholder="Capstone Project Description, Requirements, and Submission Guidelines"
                      rows={6}
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Project Guidelines Document (Optional)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload('capstone', file);
                        }}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      {stageData.assessments.capstone.document && (
                        <p className="mt-1 text-sm text-green-600">
                          ✓ {stageData.assessments.capstone.document.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        const totalDuration = getTotalDuration();
        
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Preview</h2>
              <p className="text-gray-600">Review your course before publishing</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{courseData.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">
                        <strong>Total Duration:</strong> {totalDuration.formattedDuration}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on {WORKING_HOURS_PER_DAY} working hours per day
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {courseData.stages.length} stage{courseData.stages.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="space-y-6">
                {courseData.stages.map((stage, index) => {
                  const stageDuration = formatStageDuration(stage.duration);
                  
                  return (
                    <div key={stage.id} className="border border-gray-200 rounded-lg p-4 relative">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            Stage {index + 1}: {stage.name}
                          </h4>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Clock size={14} className="mr-1" />
                            <span className="text-sm">{stageDuration.formatted}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditStage(stage.id)}
                            className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit this stage"
                          >
                            <Edit2 size={16} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStage(stage.id)}
                            className="flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete this stage"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Videos ({stage.videos.length})</h5>
                          <ul className="space-y-1">
                            {stage.videos.map((video) => (
                              <li key={video.id} className="text-sm text-gray-600 flex items-center">
                                <Youtube size={16} className="mr-2 text-red-500" />
                                {video.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Assessments</h5>
                          <div className="space-y-1">
                            {stage.assessments.quiz && (
                              <div className="text-sm text-gray-600 flex items-center">
                                <FileCheck size={16} className="mr-2 text-indigo-500" />
                                Quiz: {stage.assessments.quiz.title || 'Untitled Quiz'} ({stage.assessments.quiz.questions.length} questions)
                              </div>
                            )}
                            {stage.assessments.assignment && (
                              <div className="text-sm text-gray-600 flex items-center">
                                <Edit2 size={16} className="mr-2 text-blue-500" />
                                Assignment: {stage.assessments.assignment.title || 'Untitled Assignment'}
                              </div>
                            )}
                            {stage.assessments.capstone && (
                              <div className="text-sm text-gray-600 flex items-center">
                                <FolderGit2 size={16} className="mr-2 text-purple-500" />
                                Capstone: {stage.assessments.capstone.title || 'Untitled Capstone'}
                              </div>
                            )}
                            {!stage.assessments.quiz && !stage.assessments.assignment && !stage.assessments.capstone && (
                              <div className="text-sm text-gray-400">No assessments</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    if (editingStageId) {
      const stageIndex = courseData.stages.findIndex(s => s.id === editingStageId) + 1;
      return `Edit Stage ${stageIndex}`;
    }
    
    switch (currentStep) {
      case 1:
        return 'Course Title';
      case 2:
        return `Stage ${courseData.stages.length + 1}`;
      case 3:
        return 'Preview & Publish';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/courses')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Courses
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Progress Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Course Wizard</h1>
              <p className="text-gray-600">
                {editingStageId ? 'Editing Stage' : `Step ${currentStep} of 3`}: {getStepTitle()}
              </p>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              {courseData.stages.length > 0 && (
                <div>{courseData.stages.length} stage{courseData.stages.length !== 1 ? 's' : ''} created</div>
              )}
              {courseData.stages.length > 0 && (
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  Total: {getTotalDuration().formattedDuration}
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {!editingStageId && (
            <div className="mt-4">
              <div className="flex items-center">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step <= currentStep 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className="p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => {
              if (editingStageId) {
                handleCancelStageEdit();
              } else if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              }
            }}
            disabled={currentStep === 1 && !editingStageId}
            className="px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingStageId ? 'Cancel Edit' : 'Previous'}
          </button>
          
          <div className="flex space-x-3">
            {currentStep === 3 && !editingStageId ? (
              <button
                onClick={handlePublish}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save size={20} className="mr-2" />
                Publish Course
              </button>
            ) : editingStageId ? (
              <button
                onClick={handleSaveStageEdit}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check size={20} className="mr-2" />
                Save Changes
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {currentStep === 2 ? 'Next' : 'Continue'}
                <ArrowRight size={20} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stage Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Stage Completed!</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Stage "{currentStage.name}" created successfully
                    </p>
                    <p className="text-sm text-green-700">
                      Duration: {formatStageDuration(currentStage.duration).formatted} • {currentStage.videos.length} videos
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600">What would you like to do next?</p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={addCurrentStageAndContinue}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Another Stage
                </button>
                <button
                  onClick={addCurrentStageAndPreview}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Preview & Publish Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Validation Error</h3>
                <p className="mt-2 text-sm text-red-700">{validationMessage}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">Success</h3>
                <p className="mt-2 text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Publish Course</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Are you sure you want to publish this course?
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Course: {courseData.title}
                    </p>
                    <p className="text-sm text-blue-700">
                      {courseData.stages.length} stages • {getTotalDuration().formattedDuration}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600">
                Once published, the course will be available to all aspirants assigned to it. You can still make edits after publishing.
              </p>

              <div className="flex justify-end space-x-3 mt-2">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isPublishing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPublish}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Publish Course
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseWizard;