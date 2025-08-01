import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Youtube, FileCheck, FolderGit2, Trash2, Plus, Edit2 } from 'lucide-react';
import YouTube from 'react-youtube';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  url: string;
}

interface Quiz {
  title: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
}

interface TestTask {
  title: string;
  description: string;
}

interface Stage {
  id: string;
  name: string;
  videos: Video[];
  quiz?: Quiz;
  testTask?: TestTask;
}

interface CourseData {
  stages: Stage[];
  capstones: {
    title: string;
    description: string;
    submissionInstructions?: string;
  }[];
}

const defaultStages = [
  { id: '1', name: 'Beginner', videos: [] },
  { id: '2', name: 'Intermediate', videos: [] },
  { id: '3', name: 'Advanced', videos: [] },
  { id: '4', name: 'Pro', videos: [] }
];

const CourseBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [currentStep, setCurrentStep] = useState(1);

  const [courseData, setCourseData] = useState<CourseData>({
    stages: defaultStages,
    capstones: []
  });

  const [newStageName, setNewStageName] = useState('');
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  const addStage = () => {
    if (!newStageName.trim()) return;
    
    const newStage: Stage = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStageName,
      videos: []
    };

    setCourseData(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
    setNewStageName('');
  };

  const updateStageName = (stageId: string, newName: string) => {
    setCourseData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId ? { ...stage, name: newName } : stage
      )
    }));
    setEditingStageId(null);
  };

  const deleteStage = (stageId: string) => {
    setCourseData(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== stageId)
    }));
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const VideoSection: React.FC<{ stageId: string }> = ({ stageId }) => {
    const [newVideo, setNewVideo] = useState({ title: '', url: '' });
    const stage = courseData.stages.find(s => s.id === stageId);
    if (!stage) return null;

    const addVideo = () => {
      if (newVideo.title && newVideo.url && getYouTubeVideoId(newVideo.url)) {
        const updatedVideos = [
          ...stage.videos,
          { ...newVideo, id: Math.random().toString(36).substr(2, 9) }
        ];
        setCourseData(prev => ({
          ...prev,
          stages: prev.stages.map(s => 
            s.id === stageId ? { ...s, videos: updatedVideos } : s
          )
        }));
        setNewVideo({ title: '', url: '' });
      }
    };

    const removeVideo = (videoId: string) => {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(s => 
          s.id === stageId 
            ? { ...s, videos: s.videos.filter(v => v.id !== videoId) }
            : s
        )
      }));
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newVideo.title}
            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
            placeholder="Video Title"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex space-x-2">
            <input
              type="text"
              value={newVideo.url}
              onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
              placeholder="YouTube URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addVideo}
              disabled={!newVideo.title || !newVideo.url}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Video
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId={`videos-${stageId}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {stage.videos.map((video, index) => {
                  const videoId = getYouTubeVideoId(video.url);
                  return videoId ? (
                    <Draggable key={video.id} draggableId={video.id} index={index}>
                      {(provided) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-gray-900">{video.title}</h3>
                            <button
                              onClick={() => removeVideo(video.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="aspect-video">
                            <YouTube
                              videoId={videoId}
                              opts={{
                                width: '100%',
                                height: '100%'
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ) : null;
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  };

  const AssessmentSection: React.FC<{ stageId: string }> = ({ stageId }) => {
    const stage = courseData.stages.find(s => s.id === stageId);
    if (!stage) return null;

    const addQuiz = () => {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(s => 
          s.id === stageId 
            ? {
                ...s,
                quiz: {
                  title: '',
                  questions: [{
                    text: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0
                  }]
                }
              }
            : s
        )
      }));
    };

    const addTestTask = () => {
      setCourseData(prev => ({
        ...prev,
        stages: prev.stages.map(s => 
          s.id === stageId 
            ? {
                ...s,
                testTask: {
                  title: '',
                  description: ''
                }
              }
            : s
        )
      }));
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!stage.quiz && (
            <button
              onClick={addQuiz}
              className="p-6 border-2 border-dashed rounded-lg hover:border-indigo-500 hover:bg-indigo-50"
            >
              <div className="flex items-center justify-center">
                <FileCheck size={24} className="text-indigo-600 mr-2" />
                <span className="font-medium">Add Quiz</span>
              </div>
            </button>
          )}

          {!stage.testTask && (
            <button
              onClick={addTestTask}
              className="p-6 border-2 border-dashed rounded-lg hover:border-indigo-500 hover:bg-indigo-50"
            >
              <div className="flex items-center justify-center">
                <FolderGit2 size={24} className="text-indigo-600 mr-2" />
                <span className="font-medium">Add Test Task</span>
              </div>
            </button>
          )}
        </div>

        {/* Quiz Editor */}
        {stage.quiz && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Quiz</h3>
            {/* Quiz editor UI here */}
          </div>
        )}

        {/* Test Task Editor */}
        {stage.testTask && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Test Task</h3>
            {/* Test task editor UI here */}
          </div>
        )}
      </div>
    );
  };

  const StageManager: React.FC = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newStageName}
          onChange={(e) => setNewStageName(e.target.value)}
          placeholder="Enter stage name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addStage}
          disabled={!newStageName.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {courseData.stages.map((stage) => (
          <div
            key={stage.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            {editingStageId === stage.id ? (
              <input
                type="text"
                value={stage.name}
                onChange={(e) => updateStageName(stage.id, e.target.value)}
                onBlur={() => setEditingStageId(null)}
                autoFocus
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <span className="font-medium">{stage.name}</span>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingStageId(stage.id)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteStage(stage.id)}
                className="p-2 text-red-600 hover:text-red-900"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/courses')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Courses
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? 'Edit Course' : 'Create New Course'}
        </h2>

        {/* Stage Manager */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Course Stages</h3>
          <StageManager />
        </div>

        {/* Stage Content */}
        {courseData.stages.map((stage) => (
          <div key={stage.id} className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">{stage.name}</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">Videos</h4>
                <VideoSection stageId={stage.id} />
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-4">Assessments</h4>
                <AssessmentSection stageId={stage.id} />
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => navigate('/dashboard/courses')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Save course logic here
              navigate('/dashboard/courses');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Save size={20} className="mr-2" />
            Save Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;