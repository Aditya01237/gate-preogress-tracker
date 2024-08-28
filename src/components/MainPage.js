import React, { useState, useEffect } from 'react';
import { firestore,auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {signOut as firebaseSignOut} from 'firebase/auth';
import Spinner from './Spinner'; // Ensure you have the Spinner component available
import { topics } from '../data/topics'; // Make sure to import your topics data

const MainPage = ({ user }) => {
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true); // Track if it's the initial load
  
    useEffect(() => {
      const fetchProgress = async () => {
        try {
          const userProgressRef = doc(firestore, 'users', user.uid);
          const docSnapshot = await getDoc(userProgressRef);
          if (docSnapshot.exists()) {
            setProgress(docSnapshot.data().progress || {});
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
        } finally {
          setLoading(false);
          setInitialLoad(false); // Mark initial load as complete
        }
      };
  
      fetchProgress();
    }, [user]);
  
    useEffect(() => {
      if (!initialLoad && Object.keys(progress).length > 0) { // Only save if not initial load and progress is not empty
        const saveProgress = async () => {
          try {
            const userProgressRef = doc(firestore, 'users', user.uid);
            await setDoc(userProgressRef, { progress }, { merge: true });
          } catch (error) {
            console.error("Error saving progress:", error);
          }
        };
  
        saveProgress();
      }
    }, [progress, user, initialLoad]);
  
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
  
    const signOut = () => {
      firebaseSignOut(auth).catch(error => {
        console.error("Error signing out: ", error);
      });
    };
  
    if (loading) {
      return <Spinner />;
    }

  const milestones = ["Lectures", "Revision 1", "Revision 2", "Revision 3", "PYQ's", "Weekly Quiz", "Test Series"];
  function capitalizeFirstLetter(string) {
    return string
      .split(' ') // Split the string into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a single string
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between p-2 items-center">
          <h1 className="text-2xl font-bold text-center text-blue-900">
            {capitalizeFirstLetter(user.displayName)}
          </h1>
          <button
            onClick={() => signOut()} // You can replace this with a dedicated sign-out function
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            Sign out
          </button>
        </div>
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-900">
          GATE Progress Tracker
        </h1>
        {Object.keys(topics).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-white bg-blue-600 p-4 rounded-t-lg">
              {category}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-b-lg">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-blue-900 w-1/3">
                      Chapters
                    </th>
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

export default MainPage;
