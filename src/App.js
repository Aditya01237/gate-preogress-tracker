import React, { useState, useEffect } from 'react';
import { topics } from './data/topics';

const App = () => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const openRequest = indexedDB.open("GATEProgressDB", 1);

    openRequest.onupgradeneeded = function () {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains("progressStore")) {
        db.createObjectStore("progressStore", { keyPath: "id" });
      }
    };

    openRequest.onsuccess = function () {
      const db = openRequest.result;
      const transaction = db.transaction("progressStore", "readonly");
      const progressStore = transaction.objectStore("progressStore");
      const getRequest = progressStore.get(1);

      getRequest.onsuccess = function () {
        if (getRequest.result) {
          setProgress(getRequest.result.data);
        }
      };
    };
  }, []);

  useEffect(() => {
    const openRequest = indexedDB.open("GATEProgressDB", 1);

    openRequest.onsuccess = function () {
      const db = openRequest.result;
      const transaction = db.transaction("progressStore", "readwrite");
      const progressStore = transaction.objectStore("progressStore");
      progressStore.put({ id: 1, data: progress });
    };
  }, [progress]);

  const handleCheck = (category, topic, milestone) => {
    setProgress(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [topic]: {
          ...prev[category]?.[topic],
          [milestone]: !prev[category]?.[topic]?.[milestone]
        }
      }
    }));
  };

  const milestones = ["Lectures", "Revision 1", "Revision 2", "Revision 3", "PYQ's", "Weakly Quiz", "Test Series"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-900">GATE Progress Tracker</h1>
        {Object.keys(topics).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4 rounded-t-lg">{category}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-b-lg">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-blue-900 w-1/3">Chapters</th>
                    {milestones.map((milestone, index) => (
                      <th key={index} className="px-6 py-3 text-center text-blue-900">
                        {milestone}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topics[category].map((topic, topicIndex) => (
                    <tr
                      key={topic}
                      className={`${
                        topicIndex % 2 === 0 ? "bg-blue-50" : "bg-white"
                      } hover:bg-blue-200 transition-all duration-200`}
                    >
                      <td className="px-6 py-4 text-gray-700 border-b truncate max-w-xs" title={topic}>
                        {topic}
                      </td>
                      {milestones.map((milestone) => (
                        <td
                          key={milestone}
                          className="px-6 py-4 text-center border-b"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            checked={progress[category]?.[topic]?.[milestone] || false}
                            onChange={() => handleCheck(category, topic, milestone)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
