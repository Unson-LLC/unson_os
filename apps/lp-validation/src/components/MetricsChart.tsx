// メトリクスチャートコンポーネント  
'use client';

import { useState } from 'react';

interface ChartProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }[];
  };
}

export function MetricsChart({ title, type, data }: ChartProps) {
  const [selectedDataset, setSelectedDataset] = useState(0);

  const renderLineChart = () => {
    const maxValue = Math.max(...data.datasets[selectedDataset].data);
    const minValue = Math.min(...data.datasets[selectedDataset].data);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-64 flex items-end justify-between px-4 border-b border-l border-gray-200">
        {data.labels.map((label, index) => {
          const value = data.datasets[selectedDataset].data[index];
          const height = ((value - minValue) / range) * 200 + 20;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="flex flex-col items-center">
                <div 
                  className="w-2 bg-unson-blue rounded-t"
                  style={{ height: `${height}px` }}
                />
                <div className="w-2 h-2 bg-unson-blue rounded-full -mt-1" />
              </div>
              <div className="text-xs text-gray-600 transform -rotate-45 origin-left mt-2">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.datasets[selectedDataset].data);
    
    return (
      <div className="h-64 flex items-end justify-between px-4 border-b border-l border-gray-200">
        {data.labels.map((label, index) => {
          const value = data.datasets[selectedDataset].data[index];
          const height = (value / maxValue) * 200;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="flex flex-col items-end justify-end h-56">
                <div className="text-xs text-gray-700 mb-1">
                  {value.toLocaleString()}
                </div>
                <div 
                  className="w-12 bg-unson-green rounded-t"
                  style={{ height: `${height}px` }}
                />
              </div>
              <div className="text-xs text-gray-600 text-center w-16 truncate">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.datasets[selectedDataset].data.reduce((a, b) => a + b, 0);
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#06B6D4', '#84CC16', '#EC4899'
    ];
    
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.datasets[selectedDataset].data.map((value, index) => {
              const percentage = (value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -data.datasets[selectedDataset].data
                .slice(0, index)
                .reduce((acc, val) => acc + (val / total) * 100, 0);
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="opacity-80"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {data.datasets.map((dataset, index) => (
              <option key={index} value={index}>
                {dataset.label}
              </option>
            ))}
          </select>
          <button className="text-sm text-unson-blue hover:underline">
            エクスポート
          </button>
        </div>
      </div>

      {renderChart()}

      {/* 凡例 */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {data.datasets.map((dataset, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: dataset.backgroundColor || dataset.borderColor || '#3B82F6' 
              }}
            />
            <span className="text-gray-700">{dataset.label}</span>
          </div>
        ))}
      </div>

      {/* 統計情報 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">最大値</div>
            <div className="font-medium">
              {Math.max(...data.datasets[selectedDataset].data).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-500">最小値</div>
            <div className="font-medium">
              {Math.min(...data.datasets[selectedDataset].data).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-500">平均値</div>
            <div className="font-medium">
              {Math.round(
                data.datasets[selectedDataset].data.reduce((a, b) => a + b, 0) / 
                data.datasets[selectedDataset].data.length
              ).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-500">合計値</div>
            <div className="font-medium">
              {data.datasets[selectedDataset].data.reduce((a, b) => a + b, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}