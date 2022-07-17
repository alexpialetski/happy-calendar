import { styled } from "@mui/material/styles";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";

export type DrawerProps = MuiDrawerProps & {
  open?: boolean;
  drawerWidth: number;
};

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<DrawerProps>(({ theme, open, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer,

  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      height: "100%",
      zIndex: theme.zIndex.appBar,
    },
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
