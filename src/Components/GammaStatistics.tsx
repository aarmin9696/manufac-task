import React, { useState, useEffect } from 'react';
import data from '../data/data.json';

type Statistics = Record<string, number>;

function GammaStatistics() {
  const [statistics, setStatistics] = useState<({ measure: string } & Statistics)[] | null>(null);

  useEffect(() => {
    // Extract relevant data from JSON and calculate "Gamma" for each point
    const classData = data.map(item => ({
      Alcohol: Number(item.Alcohol),
      Ash: Number(item.Ash),
      Hue: Number(item.Hue),
      Magnesium: Number(item.Magnesium),
      Gamma: (Number(item.Ash) * Number(item.Hue)) / Number(item.Magnesium),
    }));

    // Define the statistical measures and classes
    const measures = ["Gamma Mean", "Gamma Median", "Gamma Mode"];
    const classes = Array.from(new Set(classData.map(item => item.Alcohol)));

    // Calculate statistics for "Gamma" for each measure
    const gammaStats = measures.map(measure => {
      // Initialize measure-specific data
      const measureData = {} as { measure: string } & Statistics;
      measureData.measure = measure;

      // Calculate statistics for each class
      classes.forEach(clazz => {
        // Filter and map "Gamma" values for the current class
        const classValues = classData.filter(item => item.Alcohol === clazz).map(item => item.Gamma);
        let result = 0;

        // Calculate the specified statistical measure for "Gamma"
        if (measure === "Gamma Mean") {
          result = classValues.reduce((acc, val) => acc + val, 0) / classValues.length;
        } else if (measure === "Gamma Median") {
          classValues.sort((a, b) => a - b);
          const middle = Math.floor(classValues.length / 2);
          result = classValues.length % 2 === 0 ? (classValues[middle - 1] + classValues[middle]) / 2 : classValues[middle];
        } else if (measure === "Gamma Mode") {
          const countMap = new Map<number, number>();
          classValues.forEach(value => {
            countMap.set(value, (countMap.get(value) || 0) + 1);
          });
          const maxCount = Math.max(...countMap.values());
          result = Number(
            Array.from(countMap.entries()).find(([_, count]) => count === maxCount)?.[0] || 0
          );
        }

        // Store the result for the current class
        measureData[clazz.toString()] = result;
      });

      // Return the measure-specific data
      return measureData;
    });

    // Update the statistics state
    setStatistics(gammaStats);
  }, []);

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

export default GammaStatistics;
