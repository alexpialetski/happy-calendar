import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { getUsers } from "../service/user.service";
import { User } from "../types/user";
import { Loader } from "../components/Loader";

export const People: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [people, setPeople] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    getUsers()
      .then(setPeople)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={2}>
      {people.map((person) => (
        <Grid item md={3} sm={4} xs={12}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {person.username}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {person.email}
              </Typography>
              <Typography variant="body2">
                <a href={person.website} target="blank">
                  Website
                </a>
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate(`../calendar/${person.username}`)}
              >
                Calendar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
