import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import { PAGE_SLUG } from "../constants/app";
import { UserContext } from "../context/UserContext";

type LinkData = {
  path: string;
  text: string;
  Icon: React.ReactNode;
};

export const GLOBAL_LINKS: LinkData[] = [
  {
    path: PAGE_SLUG.people,
    text: "People",
    Icon: <PeopleOutlineIcon />,
  },
];

export const PRIVATE_LINKS: LinkData[] = [
  {
    path: PAGE_SLUG.calendar,
    text: "Calendar",
    Icon: <CalendarMonthIcon />,
  },
];

export const SideMenuListItems: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const onButtonClick = (path: string) => () => {
    navigate(`/${path}`);
  };
  const isLinkActive = (path: string) => location.pathname.includes(path);

  const LINKS = [...GLOBAL_LINKS, ...(!!user ? PRIVATE_LINKS : [])];

  return (
    <List>
      {LINKS.map(({ Icon, text, path }) => (
        <ListItemButton
          key={path}
          onClick={onButtonClick(path)}
          selected={isLinkActive(path)}
        >
          <ListItemIcon>{Icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      ))}
    </List>
  );
};
