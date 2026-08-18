import { useState } from 'react';
import { CreditCard, Send, Plus, LogOut, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
}

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [balance, setBalance] = useState(5240.50);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'deposit', amount: 1500, date: '2024-08-18', description: 'Salary deposit' },
    { id: '2', type: 'withdrawal', amount: 250, date: '2024-08-17', description: 'ATM withdrawal' },
    { id: '3', type: 'deposit', amount: 500, date: '2024-08-16', description: 'Transfer from savings' },
  ]);

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      setBalance(balance + amount);
      setTransactions([
        {
          id: Date.now().toString(),
          type: 'deposit',
          amount,
          date: new Date().toISOString().split('T')[0],
          description: 'Deposit',
        },
        ...transactions,
      ]);
      setDepositAmount('');
      toast.success(`$${amount.toFixed(2)} deposited successfully!`);
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > balance) {
      toast.error('Insufficient funds');
    } else if (amount > 0) {
      setBalance(balance - amount);
      setTransactions([
        {
          id: Date.now().toString(),
          type: 'withdrawal',
          amount,
          date: new Date().toISOString().split('T')[0],
          description: 'Withdrawal',
        },
        ...transactions,
      ]);
      setWithdrawAmount('');
      toast.success(`$${amount.toFixed(2)} withdrawn successfully!`);
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your banking account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Email address" type="email" />
            <Input placeholder="Password" type="password" />
            <Button onClick={() => setIsLoggedIn(true)} className="w-full">
              Sign In
            </Button>
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">FinanceHub</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white shadow-lg">
          <CardContent className="p-8">
            <p className="text-blue-100 mb-2">Total Balance</p>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-4xl font-bold">
                {showBalance ? `$${balance.toFixed(2)}` : '••••••'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                {showBalance ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deposit Money</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                    <Button onClick={handleDeposit} className="w-full">
                      Confirm Deposit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Send className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Money</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <Button onClick={handleWithdraw} className="w-full">
                      Confirm Withdrawal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your last 10 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === 'deposit'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {tx.type === 'deposit' ? (
                        <Plus
                          className={`w-5 h-5 ${
                            tx.type === 'deposit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        />
                      ) : (
                        <Send
                          className={`w-5 h-5 ${
                            tx.type === 'deposit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {tx.description}
                      </p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      tx.type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer placeholder for features */}
      <footer className="mt-16 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4 bg-white rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">💳 Cards</h3>
              <p className="text-sm text-muted-foreground">Manage your cards</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">🔄 Transfers</h3>
              <p className="text-sm text-muted-foreground">Send money to others</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">📊 Analytics</h3>
              <p className="text-sm text-muted-foreground">Track your spending</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
