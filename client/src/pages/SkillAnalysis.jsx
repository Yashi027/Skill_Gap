import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const SkillAnalysis = () => {
  const { selectedCareer, setSelectedCareer, skillRatings, setSkillRatings, generateRoadmap } = useContext(AppContext);
  const navigate = useNavigate();

  const careerSkillMap = {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Redux"],
    backend: ["NodeJs", "Express", "MongoDb", "SQL", "API_Design"],
    fullstack: ["HTML", "CSS", "JavaScript", "React", "NodeJs", "MongoDb"]
  };

  const handleRatingChange = (skill, rating) => {
    const currentRating = skillRatings[skill] || 0;
    if (rating <= currentRating) {
      setSkillRatings({
        ...skillRatings,
        [skill]: rating
      });
      return;
    }
    navigate('/quiz', {
      state: {
        skill,
        rating
      }
    });
  };

  const handleGenerate = () => {
    if (!selectedCareer) {
      alert('Please select a career goal first');
      return;
    }
    generateRoadmap();
    navigate('/');
  };

  const currentSkills = careerSkillMap[selectedCareer] || [];

  return (
    <div className='min-h-screen bg-gray-50 px-6 py-10'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Skill Analysis</h1>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8'>
          <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
            <span className='bg-indigo-100 text-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-sm'>1</span>
            Select Career Goal
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {
              ['frontend', 'backend', 'fullstack'].map((role) => (
                <button key={role} onClick={() => setSelectedCareer(role)}
                  className={`p-4 rounded-xl border-2 transition-all capitalize font-medium ${selectedCareer === role ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'text-gray-500 border-gray-100 bg-gray-50 hover:border-gray-300'}`}>
                  {role} Developer
                </button>
              ))
            }
          </div>
        </div>

        {
          selectedCareer && (
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 transition-all'>
              <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                <span className='bg-indigo-100 text-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-sm'>2</span>
                Rate Current Skills
              </h2>
              <p className='text-sm text-gray-500 mb-6'>(1=Beginner, 5=Expert)</p>
              <div className='space-y-6'>
                {currentSkills.map((skill) => (
                  <div key={skill} className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                    <span className='font-semibold text-gray-700'>{skill}</span>
                    <div className='flex items-center gap-2'>
                      {
                        [1, 2, 3, 4, 5].map((num) => (
                          <button key={num}
                            onClick={() => handleRatingChange(skill, num)}
                            className={`h-10 w-10 rounded-full transition-all ${skillRatings[skill] === num ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'}`}>
                            {num}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-10 flex justify-center'>
                <button onClick={() => handleGenerate()}
                  className='bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200'>
                  Generate My Roadmap
                </button>
              </div>
            </div>
          )
        }

        {
          !selectedCareer && (
            <div className='text-center py-10 opacity-50'>
              <p className=''>Select a career goal above to start your analysis.</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default SkillAnalysis