// src/components/MentorshipHub.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  availability: string;
}

export const MentorshipHub = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    // Fetch mentors from backend
    const fetchMentors = async () => {
      try {
        const response = await axios.get('/api/mentors');
        setMentors(response.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  const requestMentorship = async (mentorId: string) => {
    try {
      await axios.post('/api/mentorship/request', { mentorId });
      alert('Mentorship request sent successfully!');
    } catch (error) {
      console.error('Error requesting mentorship:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Find a Mentor</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map(mentor => (
          <div key={mentor.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold">{mentor.name}</h3>
            <div className="mt-2">
              <h4 className="font-medium">Expertise:</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {mentor.expertise.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3">Availability: {mentor.availability}</p>
            <button
              onClick={() => requestMentorship(mentor.id)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Request Mentorship
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};