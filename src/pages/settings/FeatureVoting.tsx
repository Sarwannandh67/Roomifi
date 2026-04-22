import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ThumbsUp, ThumbsDown } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Split Bills by Percentage",
    description: "Allow splitting expenses based on custom percentages for each roommate",
    votes: 245,
    totalVotes: 300,
    status: "planned",
  },
  {
    id: 2,
    title: "Recurring Chores",
    description: "Set up automatically recurring chore assignments",
    votes: 180,
    totalVotes: 200,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Calendar Integration",
    description: "Sync chores and expenses with your calendar app",
    votes: 150,
    totalVotes: 200,
    status: "planned",
  },
  {
    id: 4,
    title: "Dark Mode",
    description: "Switch between light and dark themes",
    votes: 120,
    totalVotes: 150,
    status: "completed",
  },
  {
    id: 5,
    title: "Multiple Households",
    description: "Manage multiple shared living spaces",
    votes: 90,
    totalVotes: 100,
    status: "planned",
  },
];

const FeatureVotingPage = () => {
  const navigate = useNavigate();
  const [votedFeatures, setVotedFeatures] = React.useState<number[]>([]);

  const handleVote = (featureId: number, isUpvote: boolean) => {
    if (votedFeatures.includes(featureId)) {
      setVotedFeatures(votedFeatures.filter(id => id !== featureId));
    } else {
      setVotedFeatures([...votedFeatures, featureId]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-600";
      case "in-progress":
        return "bg-yellow-100 text-yellow-600";
      case "completed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="container max-w-lg mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Feature Voting</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Features</CardTitle>
          <CardDescription>Vote on features you'd like to see next</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {features.map((feature) => (
            <div key={feature.id} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{feature.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(feature.status)}`}>
                      {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={votedFeatures.includes(feature.id) ? "text-green-600" : ""}
                    onClick={() => handleVote(feature.id, true)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={(feature.votes / feature.totalVotes) * 100} />
                <p className="text-sm text-muted-foreground text-right">{feature.votes} votes</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suggest a Feature</CardTitle>
          <CardDescription>Have an idea? Let us know!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => navigate("/settings/feedback")}>
            Submit Feature Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureVotingPage; 