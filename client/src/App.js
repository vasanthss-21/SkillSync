import React from 'react';
import { Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ProblemsPage from './ProblemsPage';

function App() {
  return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white py-4">
          <nav className="container mx-auto flex justify-between">
            <div className="text-2xl font-bold">CodePlatform</div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:text-gray-300 transform">Home</Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-gray-300 transform">Problems</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-gray-300 transform">Contests</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<h1 className="text-4xl">Welcome to CodePlatform</h1>} />
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
