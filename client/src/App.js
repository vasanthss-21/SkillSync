import React, { use, useState } from 'react';
import { Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ProblemsPage from './ProblemsPage';

function App() {
  const [problem, setproblem] = useState(false);
  const features = [
    {
      title: "Practice Problems",
      description: "Sharpen your coding skills with our curated collection of programming challenges"
    },
    {
      title: "Compete",
      description: "Join coding contests and compete with developers worldwide"
    },
    {
      title: "Community",
      description: "Learn from others by exploring different solutions and approaches"
    }
  ];
  return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white py-4">
          <nav className="container mx-auto flex justify-between">
            <div className="text-2xl font-bold">CodePlatform</div>
            <ul className="flex space-x-4">
              <li onClick= {() => setproblem(false)}>
                <Link to="/" className="hover:text-gray-300 transform">Home</Link>
              </li>
              <li onClick= {() => setproblem(true)}>
                <Link to="/problems" className="hover:text-gray-300 transform">Problems</Link>
              </li>
              <li onClick= {() => setproblem(false)}>
                <Link to="/" className="hover:text-gray-300 transform">Contests</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex-grow container justify-between mx-auto p-4">
          {!problem && ( <>
            <div className='h-[250px]'>
              <h1 className="w-full text-center font-bold p-10 text-5xl">Welcome to SkillSync</h1>
              <p className="w-full text-center text-xl text-gray-600 mb-8">
                Practice coding problems, prepare for interviews, and improve your programming skills
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              </div>
              ))}
            </div>
            </>
          )}
          <Routes>
            <Route path="/problems" element={<ProblemsPage />} />
          </Routes>
          
        </main>
        <footer className="bg-gray-800 text-white text-center py-4">
          © 2024 CodePlatform. All rights reserved.
        </footer>
      </div>
  );
}

export default App;
