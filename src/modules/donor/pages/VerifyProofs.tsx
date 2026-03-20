import { useState } from 'react';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Input } from '../../../shared/components/Forms/Input';
import { StatusBadge } from '../../../shared/components/Common/StatusBadge';
import { Spinner } from '../../../shared/components/Common/Spinner';
import { useVerification } from '../hooks/useVerification';

export const VerifyProofs = () => {
  const [transactionHash, setTransactionHash] = useState('');
  const { verifyTransaction, verifying, result, clearResult } = useVerification();

  const handleVerify = async () => {
    if (!transactionHash.trim()) return;
    await verifyTransaction(transactionHash);
  };

  const handleReset = () => {
    setTransactionHash('');
    clearResult();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient">Verify Blockchain Proofs</h1>
        <p className="text-gray-600 mt-1">
          Enter a Stellar transaction hash to verify your donation on the blockchain.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Input
            label="Transaction Hash"
            placeholder="0x..."
            value={transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)}
            helper="Enter the transaction hash from your donation"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleVerify}
              loading={verifying}
              disabled={!transactionHash.trim()}
            >
              Verify on Blockchain
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {verifying && (
        <Card className="p-12 text-center">
          <Spinner size="lg" />
          <p className="text-gray-500 mt-4">Verifying transaction on Stellar...</p>
        </Card>
      )}

      {result && !verifying && (
        <Card className={`p-6 ${result.verified ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-start gap-3">
            <div className={`text-2xl ${result.verified ? 'text-green-500' : 'text-red-500'}`}>
              {result.verified ? '✓' : '✗'}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${result.verified ? 'text-green-700' : 'text-red-700'}`}>
                {result.verified ? 'Transaction Verified' : 'Verification Failed'}
              </h3>
              
              {result.verified ? (
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-gray-600 break-all">
                    <span className="font-medium">Transaction Hash:</span> {result.transactionHash}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Block Number:</span> {result.blockNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Timestamp:</span>{' '}
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <p className="font-medium text-gray-700 mb-2">Details:</p>
                    <p className="text-gray-600">Program ID: {result.details.programId}</p>
                    <p className="text-gray-600">Amount: ${result.details.amount} USDC</p>
                    <p className="text-gray-600">Beneficiary: {result.details.beneficiary}</p>
                    {result.details.batchId && (
                      <p className="text-gray-600">Batch ID: {result.details.batchId}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => window.open(`https://stellar.expert/explorer/testnet/tx/${result.transactionHash}`, '_blank')}
                  >
                    View on Stellar Explorer →
                  </Button>
                </div>
              ) : (
                <p className="text-red-600 text-sm mt-2">
                  This transaction could not be verified. Please check the hash and try again.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};