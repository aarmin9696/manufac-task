import React, { useState, useEffect } from 'react';
import data from '../data/data.json';

// Define a type for statistics
type Statistics = Record<string, number>;

function FlavanoidsStatistics() {
  // Initialize the state for statistics
  const [statistics, setStatistics] = useState<({ measure: string } & Statistics)[] | null>(null);

  // Fetch and calculate statistics on component mount
  useEffect(() => {
    // Extract relevant data from JSON and convert to numbers
    const classData = data.map(item => ({
      Alcohol: Number(item.Alcohol),
      Flavanoids: Number(item.Flavanoids),
    }));

    // Define the statistical measures and classes
    const measures = ["Flavanoids Mean", "Flavanoids Median", "Flavanoids Mode"];
    const classes = Array.from(new Set(classData.map(item => item.Alcohol)));

    // Calculate statistics for each measure
    const flavanoidsStats = measures.map(measure => {
      // Initialize measure-specific data
      const measureData = {} as { measure: string } & Statistics;
      measureData.measure = measure;

      // Calculate statistics for each class
      classes.forEach(clazz => {
        // Filter and map data for the current class
        const classValues = classData.filter(item => item.Alcohol === clazz).map(item => item.Flavanoids);

        let result = 0;

        if (measure === "Flavanoids Mean") {
          // Calculate the mean
          result = classValues.reduce((acc, val) => acc + Number(val), 0) / classValues.length;
        } else if (measure === "Flavanoids Median") {
          // Calculate the median
          classValues.sort((a, b) => Number(a) - Number(b));
          const middle = Math.floor(classValues.length / 2);
          result = classValues.length % 2 === 0 ? (Number(classValues[middle - 1]) + Number(classValues[middle])) / 2 : Number(classValues[middle]);
        } else if (measure === "Flavanoids Mode") {
          // Calculate the mode
          const countMap = new Map<number, number>();
          classValues.forEach(value => {
            countMap.set(Number(value), (countMap.get(Number(value)) || 0) + 1);
          });
          const maxCount = Math.max(...countMap.values());
          result = Number(Array.from(countMap.entries()).find(([_, count]) => count === maxCount)?.[0] || 0);
        }

        // Store the result for the current class
        measureData[clazz.toString()] = result;
      });

      // Return the measure-specific data
      return measureData;
    });

    // Update the statistics state
    setStatistics(flavanoidsStats);
  }, []);

  // Render the statistics table
  return (
    <div>
      {statistics && (
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {Object.keys(statistics[0])
                .filter(key => key !== 'measure')
                .map(clazz => (
                  <th key={clazz}>Class {clazz}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {statistics.map(row => (
              <tr key={row.measure}>
                <th>{row.measure}</th>
                {Object.keys(row)
                  .filter(key => key !== 'measure')
                  .map(clazz => (
                    <td key={clazz}>{row[clazz].toFixed(3)}</td> /* Round to 3 decimal places */
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FlavanoidsStatistics;
