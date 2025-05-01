import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Profile.css';

const Profile = ({ userId, userData }) => {
  const [skillsHave, setSkillsHave] = useState([]);
  const [skillsWish, setSkillsWish] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const [haveRes, wishRes] = await Promise.all([
          axios.get(`http://localhost:8081/api/users/${userId}/skills-have`),
          axios.get(`http://localhost:8081/api/users/${userId}/skills-wish`)
        ]);
  
        setSkillsHave(haveRes.data);
        setSkillsWish(wishRes.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
  
    if (userId) {
      fetchSkills();
    } else {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleDelete = async (skillLabel, type) => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${userId}/skills-${type}`, {
        data: { label: skillLabel }
      });
      
      if (type === 'have') {
        setSkillsHave(prev => prev.filter(skill => skill.label !== skillLabel));
      } else {
        setSkillsWish(prev => prev.filter(skill => skill.label !== skillLabel));
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to remove skill. Please try again.');
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{userData?.name}'s Profile</h2>
        <p className="profile-email">{userData?.email}</p>
        <button onClick={() => navigate('/skills')} className="edit-skills-btn">
          Edit Skills
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="skills-section">
        <div className="skills-column">
          <h3>My Skills</h3>
          {skillsHave.length > 0 ? (
            <ul className="skills-list">
              {skillsHave.map((skill, index) => (
                <li key={`have-${skill.label}-${index}`} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-label">{skill.label}</span>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(skill.label, 'have')}
                    className="delete-btn"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-skills">No skills added yet</p>
          )}
        </div>

        <div className="skills-column">
          <h3>Skills I Want</h3>
          {skillsWish.length > 0 ? (
            <ul className="skills-list">
              {skillsWish.map((skill, index) => (
                <li key={`wish-${skill.label}-${index}`} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-label">{skill.label}</span>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(skill.label, 'wish')}
                    className="delete-btn"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-skills">No skills in wishlist</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;