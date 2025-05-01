import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SkillSelection = ({ userId, userData }) => {
  const [skillsByCategory, setSkillsByCategory] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedType, setSelectedType] = useState('HAVE');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle skill selection
  const handleSkillChange = (skillLabel, isChecked) => {
    setSelectedSkills(prev => 
      isChecked 
        ? [...prev, skillLabel] 
        : prev.filter(s => s !== skillLabel)
    );
  };

  // Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/skills');
        
        // Validate response structure
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid skills data format from server');
        }

        // Process skills data
        const grouped = response.data.reduce((acc, skill) => {
          const category = skill.category || 'Other';
          if (!acc[category]) acc[category] = [];
          acc[category].push({
            ...skill,
            idSkill: skill.idSkill || `${category}-${skill.label.replace(/\s+/g, '-')}`
          });
          return acc;
        }, {});

        setSkillsByCategory(grouped);
        setError('');

      } catch (error) {
        console.error('Error fetching skills:', error);
        setError('Failed to load skills. Please try again later.');
        setSkillsByCategory({});
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSkills();
  }, []);

  // Handle skill submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) return;

    try {
      await Promise.all(selectedSkills.map(skillLabel => 
        axios.post(
          `http://localhost:8081/api/users/${userId}/skills-${selectedType.toLowerCase()}`,
          { label: skillLabel },
          { headers: { 'Content-Type': 'application/json' } }
        )
      ));
      
      setSelectedSkills([]);
      alert(`${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} added successfully!`);
    } catch (error) {
      console.error('Error adding skills:', error);
      alert(error.response?.data?.message || 'Failed to save skills. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading skills...</div>;
  }

  return (
    <div className="skill-selection-container">
      <div className="skill-header">
        <h1>Build Your Skill Profile</h1>
        <p className="subtitle">
          {selectedType === 'HAVE' 
            ? 'Select skills you currently have' 
            : 'Select skills you want to learn'}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="skill-type-toggle">
        <button
          type="button"
          className={`toggle-btn ${selectedType === 'HAVE' ? 'active' : ''}`}
          onClick={() => setSelectedType('HAVE')}
        >
          <span className="emoji">🎯</span> My Skills
        </button>
        <button
          type="button"
          className={`toggle-btn ${selectedType === 'WISH' ? 'active' : ''}`}
          onClick={() => setSelectedType('WISH')}
        >
          <span className="emoji">🚀</span> Skills I Want
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="skills-grid">
          {Object.keys(skillsByCategory).length > 0 ? (
            Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="skill-category-card">
                <div className="category-header">
                  <h3>{category}</h3>
                </div>
                <div className="skills-list">
                  {skills.map(skill => (
                    <div 
                      key={`${category}-${skill.idSkill}`}
                      className={`skill-item ${selectedSkills.includes(skill.label) ? 'selected' : ''}`}
                      onClick={() => handleSkillChange(skill.label, !selectedSkills.includes(skill.label))}
                    >
                      <div className="skill-checkbox">
                        {selectedSkills.includes(skill.label) && (
                          <span className="checkmark">✓</span>
                        )}
                      </div>
                      <span className="skill-name">{skill.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-skills">No skills available</div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            type="submit" 
            className="add-skills-btn"
            disabled={selectedSkills.length === 0}
          >
            <span className="btn-icon">+</span>
            Add {selectedSkills.length} Skill{selectedSkills.length !== 1 ? 's' : ''}
          </button>
          
          <button 
            type="button" 
            className="next-btn"
            onClick={() => navigate('/profile', { state: { userId, userData } })}
          >
            View Profile <span className="arrow">→</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillSelection;