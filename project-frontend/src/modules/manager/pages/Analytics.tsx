import { useState } from 'react';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { managerService } from '../services/managerService';

const Analytics = () => {
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState('unique_beneficiaries');

  const runQuery = async () => {
    setLoading(true);
    try {
      const result = await managerService.runZKQuery({ type: selectedQuery });
      setQueryResult(result);
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const queries = [
    { value: 'unique_beneficiaries', label: 'Unique Beneficiaries Count' },
    { value: 'distribution_by_region', label: 'Distribution by Region' },
    { value: 'avg_distribution_amount', label: 'Average Distribution Amount' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics & ZK Queries</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Builder */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">ZK Query Builder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Query Type
              </label>
              <select
                value={selectedQuery}
                onChange={(e) => setSelectedQuery(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                {queries.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>
            <Button 
              onClick={runQuery} 
              variant="primary" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Running Query...' : 'Run ZK Query'}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Query Results</h2>
          {queryResult ? (
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 mb-2">Result:</div>
                <pre className="text-sm font-mono">
                  {JSON.stringify(queryResult.result, null, 2)}
                </pre>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 mb-2">ZK Proof:</div>
                <div className="text-xs font-mono break-all">
                  {queryResult.proof}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Execution Time: {queryResult.executionTime}ms
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a query and click "Run ZK Query" to see results
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;