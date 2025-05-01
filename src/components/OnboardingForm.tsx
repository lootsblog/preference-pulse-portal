
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface OnboardingFormProps {
  onSubmit: (name: string, userId: string) => void;
}

const OnboardingForm = ({ onSubmit }: OnboardingFormProps) => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState({ name: false, userId: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {
      name: !name.trim(),
      userId: !userId.trim()
    };
    
    setErrors(newErrors);
    
    if (!newErrors.name && !newErrors.userId) {
      toast.success("Welcome to the survey!");
      onSubmit(name, userId);
    } else {
      toast.error("Please fill out all fields");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
        <CardDescription className="text-lg">
          Let's start by getting to know you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">Name is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={`h-12 ${errors.userId ? 'border-red-500' : ''}`}
            />
            {errors.userId && (
              <p className="text-red-500 text-sm">User ID is required</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          Start Survey
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;
