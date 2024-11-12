import React, { useState, useEffect } from 'react';
//import { Post, Event } from '../services/community.service';

export const CommunityHub = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTab, setSelectedTab] = useState('posts');

  useEffect(() => {
    fetchPosts();
    fetchEvents();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newPost }),
      });
      const data = await response.json();
      setPosts([data, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedTab('posts')}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'events' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedTab('events')}
        >
          Events
        </button>
      </div>

      {selectedTab === 'posts' && (
        <div>
          <form onSubmit={createPost} className="mb-6">
            <textarea
              className="w-full p-3 border rounded-lg mb-2"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Post
            </button>
          </form>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <img
                    src={post.author.avatar || '/default-avatar.png'}
                    alt=""
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mb-3">{post.content}</p>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-500 hover:text-blue-500">
                    Like ({post.likes.length})
                  </button>
                  <button className="text-gray-500 hover:text-blue-500">
                    Comment ({post.comments.length})
                  </button>
                  <button className="text-gray-500 hover:text-blue-500">
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id} className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-3">{event.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Join Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
