import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for feature requests
const features = [
  {
    id: 1,
    title: "Split Bills by Percentage",
    description: "Allow splitting expenses based on custom percentages for each roommate",
    status: "planned",
    votes: 156,
    totalVotes: 200,
    voted: true,
  },
  {
    id: 2,
    title: "Recurring Chores",
    description: "Set up chores that automatically repeat on a schedule",
    status: "in-progress",
    votes: 89,
    totalVotes: 120,
    voted: false,
  },
  {
    id: 3,
    title: "Shared Shopping Lists",
    description: "Create and manage shared shopping lists with roommates",
    status: "planned",
    votes: 45,
    totalVotes: 80,
    voted: false,
  },
  {
    id: 4,
    title: "Bill Reminders",
    description: "Get notifications when bills are due",
    status: "planned",
    votes: 67,
    totalVotes: 100,
    voted: true,
  },
];

export const FeatureVotingPage = () => {
  const navigate = useNavigate();
  const [votedFeatures, setVotedFeatures] = React.useState(
    features.reduce((acc, feature) => ({
      ...acc,
      [feature.id]: feature.voted,
    }), {})
  );

  const handleVote = (featureId: number) => {
    setVotedFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container max-w-lg mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Feature Voting</h1>
      </div>

      <div className="space-y-4">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(feature.status)}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{feature.votes} votes</span>
                      <span>{Math.round((feature.votes / feature.totalVotes) * 100)}%</span>
                    </div>
                    <Progress
                      value={(feature.votes / feature.totalVotes) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
                <Button
                  variant={votedFeatures[feature.id] ? "default" : "outline"}
                  size="icon"
                  onClick={() => handleVote(feature.id)}
                >
                  {votedFeatures[feature.id] ? (
                    <ThumbsUp className="h-4 w-4" />
                  ) : (
                    <ThumbsDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 