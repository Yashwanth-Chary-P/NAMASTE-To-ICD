import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ICD_Searchbox = () => {
  const Base_Url = `http://localhost:5000`;
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDefinition, setShowDefinition] = useState({}); // track which rows show definition

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(`${Base_Url}/`);
        const token = response.data.access_token;
        localStorage.setItem('accessToken', token);
      } catch (error) {
        console.error("Error fetching token:", error.message);
      }
    };
    fetchToken();
  }, []);

  const handleChange = (e) => setTerm(e.target.value);

  const handleSearch = async () => {
    if (!term) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${Base_Url}/${encodeURIComponent(term)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
      setShowDefinition({}); // reset definitions
    } catch (error) {
      console.error("Error searching ICD:", error.response?.data || error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDefinition = (idx) => {
    setShowDefinition((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>ICD-11 Search</h2>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder="Enter keyword"
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 12px', marginLeft: '5px' }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && results.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>#</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ICD Code</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Score</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Definition</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.code || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.title || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{(item.score*100).toFixed(2) || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => toggleDefinition(idx)}>
                      {showDefinition[idx] ? '−' : '+'}
                    </button>
                  </td>
                </tr>
                {showDefinition[idx] && (
                  <tr>
                    <td colSpan={5} style={{ border: '1px solid #ddd', padding: '8px', background: '#fafafa' }}>
                      <strong>Definition:</strong> {item.definition || 'No definition available'}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {!loading && results.length === 0 && term && <p>No results found.</p>}
    </div>
  );
};

export default ICD_Searchbox;
