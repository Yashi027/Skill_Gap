import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {

  const { roadmap, skillRatings, selectedCareer, progress } = useContext(AppContext);
  const masteredCount = roadmap.filter((s) => skillRatings[s.name] >= 4).length;
  const totalSkills = roadmap.length;
  const topSkills = roadmap.filter(s => (skillRatings[s.name] || 0) >= 4).map(s => s.name);

  return (
    <div className='min-h-screen bg-gray-50 px-6 py-10'>
      <div className='max-w-4xl mx-auto space-y-6'>

        <div className='bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6'>

          <div className='text-center md:text-left'>
            <h1 className='text-3xl font-black text-slate-800 uppercase tracking-tight'>
              {selectedCareer || "Software Engineer"}
            </h1>
            <p className='text-slate-500 mt-1 font-medium'>Professional Specializing in
              <span className='font-bold text-indigo-600 uppercase'> {topSkills[topSkills.length - 1] || 'Foundations'}. </span>
              Currently Bridging the Gap between academic theory and Industry-ready execution.
            </p>
            <div className='flex flex-wrap justify-center md:justify-start gap-4 mt-2'>
              {topSkills.slice(0, 3).map(skill => (
                <span key={skill} className='px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100'>{skill} </span>
              ))}
            </div>
          </div>

          <div className='relative flex items-center justify-center'>
            <div
              className='h-24 w-24 rounded-full flex items-center justify-center'
              style={{
                background: `conic-gradient(
              #6366f1 ${progress * 3.6}deg, 
              #e2e8f0 ${progress * 3.6}deg)`,
                padding: "10px"
              }}
            >
              <div className='h-full w-full bg-white rounded-full flex items-center justify-center'>
                <span className='text-xl font-bold text-slate-700'>{progress}%</span>
              </div>
              <div className='absolute -bottom-2 bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase shadow-lg'>
                Level: {progress > 80 ? 'Expert' : progress > 40 ? 'Intermediate' : 'Beginner'}
              </div>
            </div>
          </div>

        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-200'>
            <h3 className='font-bold text-slate-800 mb-4 flex justify-between items-center'>
              Core Power Level
              <span className='text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500'>Live Metrics</span>
            </h3>
            <div className='space-y-6'>
              {roadmap.map((skill) => {
                const rating = skillRatings[skill.name] || 0;
                const width = (rating / 5) * 100;
                return (
                  <div key={skill.name}>
                    <div className='flex justify-between text-xs font-bold mb-2 uppercase tracking-wide'>
                      <span className={rating >= 4 ? 'text-indigo-600' : 'text-slate-600'}>{skill.name}</span>
                      <span className='text-slate-500'>{rating}/5</span>
                    </div>
                    <div className='h-3 w-full bg-slate-100 rounded-full overflow-hidden' >
                      <div className={`h-full rounded-full transition-all duration-1000 bg-indigo-600`}
                        style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-200'>
            <h3 className='font-bold mb-2 text-slate-800'>Readiness Grid</h3>
            <div className='grid grid-cols-3 gap-3'>
              {roadmap.map((skill) => {
                const isMastered = (skillRatings[skill.name] || 0) >= 4;
                return (
                  <div key={skill.name}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all border ${isMastered ? 'bg-indigo-600 text-white border-indigo-600shadow-md'
                      : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                    <div className='text-[12px] font-black '>{skill.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='bg-white  p-8 rounded-3xl shadow-xl relative overflow-hidden'>
          <div className='relative z-10'>
            <h3 className='font-bold mb-4 flex items-center gap-2 text-indigo-600'>
              Recommended Next Step
            </h3>
            {masteredCount < totalSkills ? (
              <div className='text-slate-800 max-w-2xl'>
                {(() => {
                  const nextSkill = roadmap.find(s => (skillRatings[s.name] || 0) < 4)?.name
                  const resourceLink = {
                    'HTML': 'https://web.dev/learn/html',
                    'CSS': 'https://web.dev/learn/css',
                    'JavaScript': 'https://javascript.info/',
                    'React': 'https://react.dev/learn',
                    'NodeJs': 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
                    'MongoDb': 'https://www.geeksforgeeks.org/mongodb/mongodb-tutorial/',
                    'Redux': 'https://www.tutorialspoint.com/redux/redux_overview.htm',
                    'Express': 'https://expressjs.app/learn',
                    'SQL': 'https://www.w3schools.com/sql/',
                    'API Design': 'https://restfulapi.net/'
                  }
                  const studyLink = resourceLink[nextSkill];
                  return (
                    <>
                      <p>
                        To evolve your <span className='font-bold'>{selectedCareer}</span> profile,
                        your immediate priority is mastering <span className='text-indigo-500 font-bold'>
                          {nextSkill}
                        </span>
                      </p>
                      <p>Focus on building one production grade project using this tech to move the needle.</p>
                      {
                        studyLink && (
                          <div className='mt-4'>
                            <a href={studyLink}
                              target='_blank'
                              className='text-sm font-medium text-indigo-600 hover:text-indigo-700'>
                              Start studying {nextSkill} here
                            </a>
                          </div>
                        )
                      }
                    </>
                  )
                })()}
              </div>
            ) : (
              <p className='text-cyan-950 text-lg font-bold'>
                Identity Confirmed: You have reached the Industry Benchmark for {selectedCareer}!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard