'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Wallet, Send, ExternalLink } from 'lucide-react'
import { useAccount, useBalance, useConnect, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'

export default function EthWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [ wallet, setWallet ] = useState(false);
  const [ balanceF, setBalance ] = useState("");
  const [ recipient, setRecipient ] = useState("");
  const [ amount, setAmount ] = useState("");
  const [ isSending, setIsSending ] = useState(false);
  const [ txHash, setTxHash ] = useState("");

  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const balance = useBalance({ address });

  useEffect(() => { 
    async () => {
      setBalance(balance.data?.formatted || "0");
    }
  },[]);

  const { sendTransaction, data: hash } = useSendTransaction();

  const handleSendTransaction = async () => {
    setIsSending(true);
    try {
      const tx = await sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
      if (hash) {
        setTxHash(hash);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="container mx-auto p-4 mt-32">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Ethereum Wallet</CardTitle>
          <CardDescription>Connect your wallet and manage your ETH</CardDescription>
        </CardHeader>
        <CardContent>
          {!wallet ? (
            connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => {
                  connect({ connector })
                  setWallet(true);
                }}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : `Connect Wallet (${connector.name})`}
                <Wallet className="ml-2 h-4 w-4" />
              </Button>
            ))
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-secondary text-white">
                <p className="text-sm font-medium text-black">Address</p>
                <p className="text-xs text-muted-foreground break-all">{address}</p>
              </div>
              <div className="p-4 rounded-md bg-secondary">
                <p className="text-sm font-medium">Balance</p>
                <p className="text-2xl font-bold">{balanceF} ETH</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
        {wallet && (
          <CardFooter>
            <Button onClick={handleSendTransaction} disabled={isSending} className="w-full">
              {isSending ? 'Sending...' : 'Send ETH'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
      {txHash && (
        <div className="mt-4 p-4 rounded-md bg-secondary max-w-md mx-auto">
          <p className="text-sm font-medium">Transaction Hash</p>
          <a 
            href={`https://etherscan.io/tx/${txHash}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-blue-500 hover:underline break-all flex items-center"
          >
            {txHash}
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  )
}
