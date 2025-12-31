'use client';
import React from 'react';
import { Briefcase, Users, GraduationCap, Target, LineChart } from 'lucide-react';

const FeatureSection = () => {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Who Can Benefit?</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Feature Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-center mb-4">
            <Briefcase className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Young Professionals</h3>
          <p className="text-sm text-gray-600">Establish good financial habits and plan for early career goals.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-center mb-4">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Families</h3>
          <p className="text-sm text-gray-600">Manage household budgets, save for kids' education, and secure your future.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Students</h3>
          <p className="text-sm text-gray-600">Learn budgeting basics, manage loans, and build financial literacy.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-center mb-4">
            <Target className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Goal Setters</h3>
          <p className="text-sm text-gray-600">Get a clear roadmap to achieve specific financial targets and milestones.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-center mb-4">
            <LineChart className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Debt Managers</h3>
          <p className="text-sm text-gray-600">Develop strategies to reduce debt effectively and improve financial health.</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;